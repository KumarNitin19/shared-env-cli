const createFile = require("../create-file");
const { readFileContent } = require("../read-file");

// adding entries to the file
const writeInFile = async (file, env_variables) => {
  if (env_variables.length) {
    env_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(`${objKey}=${variable[objKey]}\n`);
    });
    file.end();
  } else {
    throw new Error("Something went wrong!!");
  }
};

// creating/adding entries to the file
const readAndWriteFile = (env_variables) => {
  const pathToFileOrDir = "./.env.local";
  // const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  // if (isFilePresent) {
  //   readFileContent();
  // } else {
  const fileName = ".env.local";
  const file = createFile(fileName);
  writeInFile(file, env_variables);
  // }
};

module.exports = { writeInFile, readAndWriteFile };
