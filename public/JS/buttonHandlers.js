"use strict";

const createLoungeBtn = document.querySelector(".create-lounge");
const joinLoungeBtn = document.querySelector(".join-lounge");

const loungeCodeEl = document.querySelectorAll(".lounge-num");

createLoungeBtn.addEventListener("click", async function () {
  let ip = "";
  await fetch("https://api.ipify.org?format=json").then((res) => {
    res
      .json()
      .then((data) =>
        fetch("https://createlounge-72cxfkv3ra-uc.a.run.app", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: data.ip }),
        }),
      )
      .then((res) => {
        res.json().then((data) => {
          window.location.href = `/lounge/${data.loungeNum}`;
        });
      });
  });
});

joinLoungeBtn.addEventListener("click", async () => {
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
    const loungeNum =
      numbers[0].value +
      numbers[1].value +
      numbers[2].value +
      numbers[3].value +
      numbers[4].value +
      numbers[5].value;
    const loungeName = `lounge-${loungeNum}`;

    window.location.href = `/lounge/${loungeNum}`;

    return;
  }
});
