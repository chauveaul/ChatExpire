"use strict";

const createLoungeBtn = document.querySelector(".create-lounge");
const joinLoungeBtn = document.querySelector(".join-lounge");

const loungeCodeEl = document.querySelectorAll(".lounge-num");

createLoungeBtn.addEventListener("click", function () {
  //Call firebase function
  fetch("https://createlounge-72cxfkv3ra-uc.a.run.app");
  // fetch("http://127.0.0.1:5001/chatexpire/us-central1/createLounge");
});

joinLoungeBtn.addEventListener("click", () => {
  const numbers = [...loungeCodeEl];
  if (
    !numbers.some((number) => {
      console.log(number.value);
      if (number.value === "") {
        //Add error message to fill all boxes?
        return true;
      }
    })
  ) {
    const loungeName = `lounge-${numbers[0].value + numbers[1].value + numbers[2].value + numbers[3].value + numbers[4].value + numbers[5].value}`;
    fetch("https://joinlounge-72cxfkv3ra-uc.a.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loungeName: loungeName }),
    }).then((res) => {
      console.log(res);
    });
    return;
  }
});
