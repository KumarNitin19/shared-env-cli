const fs = require("fs").promises;
const fsAsync = fs.promises;
const path = require("path");

// reading a env file
const readFileContent = async (fileName) => {
  try {
    const data = await fsAsync?.readFile(fileName, "utf8");
    if (data) {
      const keyValuePairs = data
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [key, value] = line.split("=");
          return key && value ? { [key.trim()]: value.trim() } : null;
        })
        .filter(Boolean);

      return keyValuePairs;
    }
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

// reading varVault.json file to retrieve projectId
const getProjectId = async () => {
  try {
    const filePath = path.join(process.cwd(), "varVault.json"); // Get file path from the calling project
    const data = await fs.readFile(filePath, "utf8"); // Read file
    const jsonData = JSON.parse(data); // Parse JSON
    return jsonData;
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = { readFileContent, readGitFle, getProjectId };
