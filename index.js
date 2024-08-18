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

const createFile = () => {
  const createStream = fs.createWriteStream(".env.local");
  createStream.end();
  return createStream;
};

const readFileContent = () => {
  fs.readFile(fileName, "utf8", function (err, data) {
    const allVariablesAndThereValue = data?.split("\n");
    const keyValuePairs = allVariablesAndThereValue.map((val) => {
      const keyAndValue = val.split("=");
      return {
        [keyAndValue[0]]: keyAndValue[1],
      };
    });
    return keyValuePairs;
  });
};

const writeInFile = (file) => {
  file.write("Hi, JournalDEV Users. ");
  file.write("Thank You.");
};
