const fs = require("fs");

// reading a env file
const readFileContent = (fileName) => {
  fs.readFile(fileName, "utf8", function (err, data) {
    const allVariablesAndThereValue = data?.split("\n");
    const keyValuePairs = allVariablesAndThereValue
      .filter((val) => val)
      .map((val) => {
        const keyAndValue = val.split("=");
        if (keyAndValue[0] && keyAndValue[1]) {
          return {
            [keyAndValue[0]]: keyAndValue[1],
          };
        }
      });
    return keyValuePairs;
  });
};

// reading .gitignore file
const readGitFle = async () => {
  try {
    let fileContent = await fsAsync.readFile(".gitignore", "utf-8");
    return fileContent.split("\n");
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = { readFileContent, readGitFle };
