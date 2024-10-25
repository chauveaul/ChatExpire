"use strict";

const chatboxContentEl = document.querySelector(".chatbox-content");
const chatboxInputEl = document.querySelector(".chatbox-input");
const chatboxSendEl = document.querySelector(".chatbox-send");
const navDivEl = document.querySelector(".nav-div");

const bodyEl = document.querySelector("body");

navDivEl.innerHTML = `<p class="nav-link">The lounge number is: ${window.location.pathname.split("/")[2]}</p>`;

let ip = "";

chatboxSendEl.addEventListener("click", () => {
  console.log("click");
  const message = chatboxInputEl.value;
  if (message) {
    sendMessage(message);
    chatboxInputEl.value = "";
  }
});

chatboxInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    chatboxSendEl.click();
  }
});

const loungeName = `lounge-${window.location.pathname.split("/")[2]}`;

function createLeftMessage(message) {
  chatboxContentEl.innerHTML += `
    <div class="message left-message">
      <p>${message}</p>
    </div>
  `;
}

function createRightMessage(message) {
  chatboxContentEl.innerHTML += `
    <div class="message right-message">
      ${message}
    </div>
  `;
}

async function sendMessage(message) {
  await fetch("https://sendmessage-72cxfkv3ra-uc.a.run.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loungeName: loungeName, message: message, ip: ip }),
  });
  createRightMessage(message);
  chatboxContentEl.scrollTop = chatboxContentEl.scrollHeight;
}

function loadMessages() {
  const previousMessages = chatboxContentEl.innerHTML;
  fetch("https://loadmessages-72cxfkv3ra-uc.a.run.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loungeName: loungeName, ip: ip }),
  }).then((res) => {
    res.json().then((data) => {
      chatboxContentEl.innerHTML = "";
      data.forEach((message) => {
        if (message.ip === ip) {
          createRightMessage(message.message);
        } else {
          createLeftMessage(message.message);
        }
      });
      if (chatboxContentEl.innerHTML !== previousMessages)
        chatboxContentEl.scrollTop = chatboxContentEl.scrollHeight;
    });
  });
}

fetch("https://api.ipify.org?format=json").then((res) => {
  res
    .json()
    .then((data) => (ip = data.ip))
    .then(() =>
      fetch("https://joinlounge-72cxfkv3ra-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loungeName: loungeName, ip: ip }),
      }),
    )
    .then((res) => {
      res.status === 200
        ? loadMessages()
        : (bodyEl.innerHTML = `
  <body>
    <nav class="flex nav">
      <a href="../../index.html" class="nav-link h1-size">ChatExpire</a>
    </nav>

    <article>
      <div class="flex align-center justify-center">
        <p class="h1-size">
          Oh no! We couldn't find the lounge you were looking for.
        </p>
        <p class="h2-size">
          Try looking for another one <a href="../../index.html">here</a>
        </p>
      </div>
    </article>
  </body>
`);
    });
});

db.collection("lounges")
  .doc(`${loungeName}`)
  .collection("messages")
  .onSnapshot((snap) => {
    loadMessages();
  });
