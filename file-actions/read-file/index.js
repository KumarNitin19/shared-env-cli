const fs = require("fs").promises;

// reading a env file
const readFileContent = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, "utf8");
    const keyValuePairs = data
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [key, value] = line.split("=");
        return key && value ? { [key.trim()]: value.trim() } : null;
      })
      .filter(Boolean);

    return keyValuePairs;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
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
