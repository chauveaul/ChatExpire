"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors");

const express = require("express");

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cors());
expressApp.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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

exports.createLounge = onRequest(async (req, res) => {
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
  });

  res.status(200).send(`Lounge created with name ${loungeName}`);
});

exports.joinLounge = onRequest({ cors: true }, async (req, res) => {
  console.log(req.body);
  const loungeName = req.body.loungeName;
  console.log(`Trying to join lounge with name ${loungeName}`);
  const loungesRef = db.collection("lounges");
  let doc = await loungesRef.doc(loungeName).get();
  if (doc.exists) {
    //Fetch all messages logic in here and redirect to the chat page
    res.status(200).send(`Joined lounge with name ${loungeName}`);
  } else {
    res.status(404).send(`Lounge with name ${loungeName} does not exist`);
  }
});

exports.app = onRequest(expressApp);
