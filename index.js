#!/usr/bin/env node

getENVData();

const fs = require("fs");
const fsAsync = require("node:fs/promises");

const checkWeatherFileExistsOrNot = (pathToFileOrDir) => {
  if (fs.existsSync(pathToFileOrDir)) {
    return true;
  }
  return false;
};

const createFile = (fileName) => {
  const createStream = fs.createWriteStream(".env.local");
  // createStream.end();
  return createStream;
};

const readFileContent = (fileName) => {
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

const writeInFile = async (file) => {
  const dataToWrite = await getENVData();
  if (dataToWrite && dataToWrite[0].env_variables.length) {
    dataToWrite[0].env_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(`${objKey}=${variable[objKey]}`);
    });
    file.end();
  } else {
    throw new Error("Something went wrong!!");
  }
};

const readGitFle = async () => {
  try {
    let fileContent = await fsAsync.readFile(".gitignore", "utf-8");
    return fileContent.split("\n");
  } catch (error) {
    console.log("Error: ", error);
  }
};

const addToGitIgnore = async () => {
  const pathToFileOrDir = "./.gitignore";
  const fileName = ".gitignore";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  if (isFilePresent) {
    const fileContent = await readGitFle();
    if (fileContent.includes(fileName)) return;
    fs.appendFile(fileName, "\n.env.local", function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }
};

const readAndWriteFile = () => {
  const pathToFileOrDir = "./.env.local";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  if (isFilePresent) {
    readFileContent();
  } else {
    const fileName = ".env.local";
    const file = createFile(fileName);
    writeInFile(file);
  }
};

addToGitIgnore();
