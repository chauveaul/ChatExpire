"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { firestore } = require("firebase-admin");
const cors = require("cors");
const path = require("path");

const express = require("express");
const { timeStamp, warn } = require("console");

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cors());
expressApp.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.append("Cache-Control", "no-store");
  next();
});
expressApp.use(express.static("public"));

const firebaseConfig = {
  apiKey: "AIzaSyBxJlHA4Y5uC5_aJbzqIFlhG1rbikc2fPM",
  authDomain: "chatexpire.firebaseapp.com",
  projectId: "chatexpire",
  storageBucket: "chatexpire.appspot.com",
  messagingSenderId: "955509183528",
  appId: "1:955509183528:web:f1ae208a9d4667c6de911d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
exports.createLounge = onRequest({ cors: true }, async (req, res) => {
  let loungeNumber = String(Math.floor(Math.random() * 1000000) + 1).padStart(
    6,
    "0",
  );
  let loungeName = `lounge-${loungeNumber}`;
  console.log(`Trying to create a lounge with name ${loungeName}`);

  const loungesRef = db.collection("lounges");
  let doc = await loungesRef.doc(loungeName).get();
  while (doc.exists) {
    loungeNumber = String(Math.floor(Math.random() * 1000000) + 1).padStart(
      6,
      "0",
    );
    loungeName = `lounge-${loungeNumber}`;
    console.log(`Trying to create a lounge with name ${loungeName}`);
    doc = await loungesRef.doc(loungeName).get();
  }

  await loungesRef.doc(loungeName).set({
    exists: true,
    ip1: req.body.ip,
    ip2: "",
    publishedAt: firestore.Timestamp.now(),
  });
  res.status(200).send(JSON.stringify({ loungeNum: loungeNumber }));
});

exports.joinLounge = onRequest({ cors: true }, async (req, res) => {
  console.log(req.body);
  const loungeName = req.body.loungeName;
  console.log(`Trying to join lounge with name ${loungeName}`);
  const loungesRef = db.collection("lounges");
  let doc = await loungesRef.doc(loungeName).get();
  if (doc.exists) {
    if (doc.data().ip2 === "" && doc.data().ip1 !== req.body.ip) {
      await loungesRef.doc(loungeName).update({
        ip2: req.body.ip,
      });
      res.status(200).send(`Joined lounge with name ${loungeName}`);
    } else if (
      doc.data().ip1 === req.body.ip ||
      doc.data().ip2 === req.body.ip
    ) {
      res.status(200).send(`Joined lounge with name ${loungeName}`);
      //load messages here
    } else {
      res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }
  } else {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  }
});

expressApp.get("/lounge/:num", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "lounge.html"));
});

exports.deleteExpiredDocuments = onSchedule("every 24 hours", async (event) => {
  const timeNow = firestore.Timestamp.now();
  const timeStamp = firestore.Timestamp.fromMillis(
    timeNow.toMillis() - 86400000,
  );

  const snap = await db
    .collection("lounges")
    .where("publishedAt", "<", timeStamp)
    .get();
  let promises = [];
  snap.forEach((snap) => {
    promises.push(snap.ref.delete());
  });
  return Promise.all(promises);
});

exports.sendMessage = onRequest({ cors: true }, async (req, res) => {
  const loungeName = req.body.loungeName;
  const message = req.body.message;
  const ip = req.body.ip;

  const loungesRef = db.collection("lounges");
  const doc = await loungesRef.doc(loungeName).get();
  if (doc.exists) {
    if (doc.data().ip1 === ip || doc.data().ip2 === ip) {
      await loungesRef.doc(loungeName).collection("messages").add({
        message: message,
        ip: ip,
        timestamp: firestore.Timestamp.now(),
      });
      res.status(200).send("Message sent");
    } else {
      res.status(400).send("You do not have access to this lounge");
    }
  } else {
    res.status(404).send(`Lounge with name ${loungeName} does not exist`);
  }
});

exports.loadMessages = onRequest({ cors: true }, async (req, res) => {
  //Fix timestamp sorting for messages
  const loungeName = req.body.loungeName;
  const ip = req.body.ip;

  const loungesRef = db.collection("lounges");
  const doc = await loungesRef.doc(loungeName).get();
  const messagesRef = loungesRef.doc(loungeName).collection("messages");

  if (doc.exists) {
    if (doc.data().ip1 === ip || doc.data().ip2 === ip) {
      const messages = await messagesRef.orderBy(`timestamp`).get();
      const messagesArray = [];
      messages.forEach((message) => {
        messagesArray.push(message.data());
      });
      res.status(200).send(messagesArray);
    } else {
      res.status(400).send("You do not have access to this lounge");
    }
  } else {
    res.status(404).send(`Lounge with name ${loungeName} does not exist`);
  }
});

exports.app = onRequest({ cors: true }, expressApp);
