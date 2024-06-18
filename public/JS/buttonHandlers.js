"use strict";

const createLoungeBtn = document.querySelector(".create-lounge");

createLoungeBtn.addEventListener("click", function () {
  //Call firebase function
  fetch("https://createlounge-72cxfkv3ra-uc.a.run.app");
  // fetch("http://127.0.0.1:5001/chatexpire/us-central1/createLounge");
});
