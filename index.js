#!/usr/bin/env node

require("dotenv").config();
// const { db } = require("./firebase");

// const getENVData = async () => {
//   try {
//     const collectionRef = db.collection("Projects");
//     const finalData = [];
//     const projectSnap = await collectionRef.get();
//     projectSnap.forEach((project) => {
//       finalData.push(project.data());
//     });
//     return finalData;
//   } catch (error) {
//     console.log("Error : ", error);
//   }
// };

// getENVData();

const fs = require("fs");

const pathToFileOrDir = "./.env.local";
const fileName = ".env.local";

const checkWeatherFileExistsOrNot = () => {
  if (fs.existsSync(pathToFileOrDir)) {
    return true;
  }
  return false;
};
