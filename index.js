#!/usr/bin/env node

const { db } = require("./firebase");

require("dotenv").config();

const getENVData = async () => {
  try {
    const collectionRef = db.collection("Projects");
    const finalData = [];
    const projectSnap = await collectionRef.get();
    projectSnap.forEach((project) => {
      finalData.push(project.data());
    });
    console.log("------->", finalData);
    return finalData;
  } catch (error) {
    console.log("Error : ", error);
  }
};

getENVData();
