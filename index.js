#!/usr/bin/env node
const readline = require("readline");
const fetchENVVariableForProject = require("./query");
const { readAndWriteFile } = require("./file-actions/write-file");
const { getProjectId } = require("./file-actions/read-file");
const fs = require("fs");
const fsAsync = fs.promises;
const path = require("path");

// Constants

// ANSI color codes for random colors
const colors = [
  "\x1b[36m", // Cyan
  "\x1b[31m", // Red
  "\x1b[32m", // Green
  "\x1b[33m", // Yellow
  "\x1b[34m", // Blue
  "\x1b[35m", // Magenta
];

// Reset color
const resetColor = "\x1b[0m";

// Creating a file if it doesn't exist
const createFile = (fileName) => {
  const createStream = fs.createWriteStream(fileName);
  return createStream;
};

// FILE: Read actions
// reading a env file
const readFileContent = async (fileName) => {
  try {
    const data = await fs?.readFile(fileName, "utf8");
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
    // console.error("Error reading file:", err);
    return [];
  }
};

// reading .gitignore file
const readGitFile = async () => {
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

// Function to render the list with random colors
function renderList(list, selectedIndex, colorMap) {
  console.clear();
  console.log("Use Up/Down arrows to navigate and press Enter to select:\n");
  list.forEach((item, index) => {
    const color = colorMap[index];
    if (index === selectedIndex) {
      console.log(`${color}-> ${item}${resetColor}`); // Highlight the selected item
    } else {
      console.log(`${color}   ${item}${resetColor}`); // Normal unselected item
    }
  });
}

// Main function
async function startCLI() {
  let selectedIndex = 0;
  const projectDetails = await getProjectId();
  const envGroups = await fetchENVVariableForProject(projectDetails?.projectId);
  const groupNames = envGroups?.groups?.map((group) => group?.groupName);
  if (groupNames?.length) {
    // Generate a random color for each item
    const colorMap = groupNames.map((_, index) => colors[index]);

    // Render the initial list
    renderList(groupNames, selectedIndex, colorMap);

    // Set up keypress handling
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", async (_, key) => {
      if (key.name === "up") {
        selectedIndex =
          selectedIndex > 0 ? selectedIndex - 1 : groupNames.length - 1;
        renderList(groupNames, selectedIndex, colorMap);
      } else if (key.name === "down") {
        selectedIndex =
          selectedIndex < groupNames.length - 1 ? selectedIndex + 1 : 0;
        renderList(groupNames, selectedIndex, colorMap);
      } else if (key.name === "return") {
        console.clear();
        console.log(`You selected: ${groupNames[selectedIndex]}`);
        const selectedENV = envGroups?.groups?.find(
          (group) => group?.groupName === groupNames[selectedIndex]
        );
        const variables = selectedENV?.variables;
        await readAndWriteFile(variables);
        console.log("Successfully added env variables.");
        process.stdin.setRawMode(false);
        process.stdin.pause();
      } else if (key.ctrl && key.name === "c") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log("\nExited.");
      }
    });
  }
}

// Start the CLI tool
startCLI();
