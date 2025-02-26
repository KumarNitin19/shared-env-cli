const { readGitFile } = require("../../file-actions/read-file");
const { checkWeatherFileExistsOrNot } = require("../utils");
const fs = require("fs");

// add env file to .gitignore
const addToGitIgnore = async () => {
  const pathToFileOrDir = "../../.gitignore";
  const fileName = ".gitignore";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  if (isFilePresent) {
    const fileContent = await readGitFile();
    if (fileContent.includes(fileName)) return;
    fs.appendFile(fileName, "\n.env \nvarVault.json", function (err) {
      if (err) throw err;
    });
  } else {
    fs.appendFile(fileName, ".env\nvarVault.json", function (err) {
      if (err) throw err;
    });
  }
};

module.exports = addToGitIgnore;
