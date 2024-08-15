"use strict";

const numbers = document.querySelectorAll(".lounge-num");
const joinLounge = document.querySelector(".join-lounge");

for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("keydown", function () {
    if (event.key === "Enter") {
      joinLounge.click();
    }
  });
}

for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (i !== 0 && i !== 5) {
        numbers[i - 1].focus();
        numbers[i - 1].value = "";
      }
      if (i === 5 && numbers[5].value === "") {
        numbers[i - 1].focus();
        numbers[i - 1].value = "";
      // }
      numbers[i].value = "";
    } else {
      event.preventDefault();
      if (!isNaN(Number(event.key))) {
        if (i === numbers.length - 1 && numbers[i].value !== "") {
          return true;
        } else if (event.keyCode > 47 && event.keyCode < 58) {
          numbers[i].value = event.key;
          if (i !== numbers.length - 1) numbers[i + 1].focus();
          event.preventDefault();
        } else if (event.keyCode > 64 && event.keyCode < 91) {
          numbers[i].value = String.fromCharCode(event.keyCode);
          if (i !== numbers.length - 1) numbers[i + 1].focus();
          event.preventDefault();
        }
      }
    }
  });
}
