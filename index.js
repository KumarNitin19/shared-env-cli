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

// Spinner
const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerIndex = 0;

const blue = "\x1b[34m"; // Blue color
const reset = "\x1b[0m"; // Reset color
const clearLine = "\x1b[2K"; // Clears the current line
const moveCursorToStart = "\r";

// Utility Functions

// Fetch user GitHub session
const fetchGitHubSession = () => {
  try {
    const githubUsername = execSync("git config user.name").toString().trim();
    if (!githubUsername) {
      console.error("GitHub session not found. Please login via GitHub.");
      process.exit(1);
    }
    return githubUsername;
  } catch (error) {
    console.error("Error fetching GitHub session:", error.message);
    process.exit(1);
  }
};

// Check whether the env file is present or not
const checkWeatherFileExistsOrNot = (pathname) => {
  const filePath = path.join(__dirname, pathname); // Change to the file you want to check

  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
};

// Loading state enable
const startSpinner = (message) => {
  process.stdout.write("\n");
  process.stdout.write("\x1B[?25l"); // Hide cursor

  return setInterval(() => {
    process.stdout.write(
      `${moveCursorToStart}${clearLine}${blue}${spinnerFrames[spinnerIndex]} ${message}  ${reset}`
    );
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
};

// Loading state diable
const stopSpinner = (spinner, message, isSuccess = true) => {
  clearInterval(spinner);
  process.stdout.write(`${moveCursorToStart}${clearLine}`); // Clear the spinner line
  console.log(`${isSuccess ? "✅" : "❌"} ${message}\n`); // Print success/failure message
  process.stdout.write("\x1B[?25h"); // Show cursor
};

// Fetch projects
const fetchENVVariableForProject = async (projectId) => {
  console.log("\nChecking GitHub authorization...\n"); // Add space before starting
  const githubUserName = fetchGitHubSession();
  if (!githubUserName) {
    stopSpinner(spinner, "User not logged-in to github!!", false);
  }
  const spinner = startSpinner("Authenticating...");
  try {
    const resp = await fetch(
      `http:127.0.0.1:3000/cli/groups/${githubUserName}/${projectId}`
    );

    const data = await resp.json();

    if (data?.error) {
      stopSpinner(spinner, data.error, false);
      return;
    }
    stopSpinner(spinner, "Successfully fetched env variables!!");
    return data;
  } catch (error) {
    // console.log("Error : ", error);
    stopSpinner(spinner, "Error fetching!", false);
  }
};

// Creating a file if it doesn't exist
const createFile = (fileName) => {
  const createStream = fs.createWriteStream(fileName);
  return createStream;
};

// FILE: read actions
// 1. reading a env file
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

// 2. reading .gitignore file
const readGitFile = async () => {
  try {
    let fileContent = await fsAsync.readFile(".gitignore", "utf-8");
    return fileContent.split("\n");
  } catch (error) {
    console.log("Error: ", error);
  }
};

// 3. reading varVault.json file to retrieve projectId
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

// FILE: write actions

const writeInFile = async (file, old_variables, new_variables) => {
  if (old_variables?.length) {
    old_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(
        `${new_variables?.length > 0 ? "//  " : ""} ${objKey}=${
          variable[objKey]
        }\n`
      );
    });
  }
  if (new_variables?.length) {
    if (old_variables?.length) {
      file.write("\n \n \n");
      file.write("// New Variables \n");
    }
    new_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(`${objKey}=${variable[objKey]}\n`);
    });
    file.end();
  } else {
    console.log("No variables found");
  }
};

// creating/adding entries to the file
const readAndWriteFile = async (env_variables) => {
  const pathToFileOrDir = "../.env";
  const fileName = ".env";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  await readFileContent(fileName);
  if (isFilePresent) {
    const variables = await readFileContent(fileName);
    const file = createFile(fileName);
    if (variables?.length) {
      writeInFile(file, variables, env_variables);
    } else writeInFile(file, [], env_variables);
  } else {
    const file = createFile(fileName);
    addToGitIgnore();
    writeInFile(file, [], env_variables);
  }
};

// Git-Actions

const addToGitIgnore = async () => {
  const pathToFileOrDir = "../.gitignore";
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
