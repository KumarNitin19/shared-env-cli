#!/usr/bin/env node

const { initializeFirebaseApp } = require("./firebase");
const { getDocs, collection, query } = require("firebase/firestore");

initializeFirebaseApp();
