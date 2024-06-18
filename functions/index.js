"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

const express = require("express");

const expressApp = express();
expressApp.use(express.json());
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
const app = initializeApp(firebaseConfig);

exports.app = onRequest(expressApp);
