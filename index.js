#!/usr/bin/env node

const readline = require("readline"),
  fs = require("fs"),
  fsAsync = fs.promises,
  path = require("path"),
  { execSync } = require("child_process");

// ANSI color codes for UI enhancement
const colors = [
  "\x1b[36m",
  "\x1b[31m",
  "\x1b[32m",
  "\x1b[33m",
  "\x1b[34m",
  "\x1b[35m",
];
const resetColor = "\x1b[0m";

// For getting selected env variables group name
let selectedIndex = 0;

// To store all the available groups
let groupNames = [];

// Spinner animation frames
const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerIndex = 0;

/**
 * Fetches the logged-in GitHub username
 */
const fetchGitHubSession = () => {
  try {
    return execSync("git config user.name").toString().trim();
  } catch {
    console.error("GitHub session not found. Please login.");
    process.exit(1);
  }
};

/**
 * Checks if a file exists in the current directory
 */
const checkFileExists = (relativePath) => {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  return fs.existsSync(absolutePath);
};

/**
 * Starts a CLI spinner animation for loading states
 */
const startSpinner = (msg) => {
  process.stdout.write("\n\x1B[?25l"); // Hide cursor
  return setInterval(() => {
    process.stdout.write(
      `\r\x1b[34m${spinnerFrames[spinnerIndex]} ${msg} \x1b[0m`
    );
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
};

/**
 * Stops the spinner and displays a success/failure message
 */
const stopSpinner = (spinner, msg, success = true) => {
  clearInterval(spinner);
  console.log(`\r\x1b[2K${success ? "✅" : "❌"} ${msg}\n\x1B[?25h`); // Show cursor
};

/**
 * Fetches environment variables from a local API based on the project ID
 */
const fetchENVVariableForProject = async (projectId) => {
  console.log("\nChecking GitHub authorization...");
  const githubUserName = fetchGitHubSession();
  const spinner = startSpinner("Authenticating...");
  try {
    const resp = await fetch(
      `http://127.0.0.1:3000/cli/groups/${githubUserName}/${projectId}`
    );
    const data = await resp.json();
    stopSpinner(
      spinner,
      data?.error || "Successfully fetched env variables!",
      !data?.error
    );
    return data;
  } catch {
    stopSpinner(spinner, "Error fetching!", false);
  }
};

/**
 * Reads and parses a given file into key-value pairs
 */
const readFileContent = async (fileName) => {
  try {
    const data = await fsAsync.readFile(fileName, "utf8");
    return data
      ? data
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [key, value] = line.split("=");
            return key && value ? { [key.trim()]: value.trim() } : null;
          })
          .filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

/**
 * Reads the `.gitignore` file content
 */
const readGitFile = async () => {
  try {
    return (await fsAsync.readFile(".gitignore", "utf-8")).split("\n");
  } catch (error) {
    console.log("Error:", error);
  }
};

/**
 * Reads and parses the `varVault.json` file to retrieve the project ID
 */
const getProjectId = async () => {
  try {
    return JSON.parse(await fsAsync.readFile("varVault.json", "utf8"));
  } catch (error) {
    console.log("Error:", error);
  }
};

/**
 * Writes old and new environment variables to the `.env` file
 */
const writeInFile = async (file, oldVars, newVars) => {
  // Write old variables (if present)
  if (oldVars?.length) {
    oldVars.forEach((variable) => {
      const key = Object.keys(variable)[0];
      file.write(`${newVars?.length ? "#  " : ""}${key}=${variable[key]}\n`);
    });
  }

  // Write new variables (if present)
  if (newVars?.length) {
    if (oldVars?.length) {
      file.write(`\n\n\n# New ${groupNames[selectedIndex] || ""} Variables\n`);
    }
    newVars.forEach((variable) => {
      const key = Object.keys(variable)[0];
      file.write(`${key}=${variable[key]}\n`);
    });

    file.end();
  } else {
    console.log("No variables found");
  }
};

/**
 * Creates a new file in the current directory
 */
const createFile = (fileName) => fs.createWriteStream(fileName);

/**
 * Reads and updates the `.env` file with new variables
 */
const readAndWriteFile = async (envVars) => {
  const fileName = ".env",
    fileExists = checkFileExists(fileName),
    variables = fileExists ? await readFileContent(fileName) : [];
  const file = createFile(fileName);
  if (!fileExists) addToGitIgnore();
  writeInFile(file, variables, envVars);
};

/**
 * Adds `.env` and `varVault.json` to `.gitignore` to prevent accidental commits
 */
const addToGitIgnore = async () => {
  const fileName = ".gitignore",
    exists = checkFileExists(fileName),
    fileContent = exists ? await readGitFile() : [];
  if (!fileContent.includes(fileName))
    fs.appendFile(
      fileName,
      "\n.env \nvarVault.json",
      (err) => err && console.error(err)
    );
};

/**
 * Renders the list of environment groups with color-coded options
 */
const renderList = (list, selectedIndex, colorMap) => {
  console.clear();
  console.log("Use Up/Down arrows to navigate and press Enter to select:\n");
  list.forEach((item, index) =>
    console.log(
      `${colorMap[index]}${
        index === selectedIndex ? "->" : "  "
      } ${item}${resetColor}`
    )
  );
};

/**
 * CLI entry point: fetches project data and allows users to select an environment group
 */

async function startCLI() {
  const projectDetails = await getProjectId(),
    envGroups = await fetchENVVariableForProject(projectDetails?.projectId);
  groupNames = envGroups?.groups?.map((group) => group?.groupName);

  if (groupNames?.length) {
    const colorMap = groupNames.map((_, i) => colors[i]);
    renderList(groupNames, selectedIndex, colorMap);

    // Capture user keyboard inputs
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", async (_, key) => {
      if (["up", "down"].includes(key.name)) {
        selectedIndex =
          key.name === "up"
            ? selectedIndex > 0
              ? selectedIndex - 1
              : groupNames.length - 1
            : selectedIndex < groupNames.length - 1
            ? selectedIndex + 1
            : 0;
        renderList(groupNames, selectedIndex, colorMap);
      } else if (key.name === "return") {
        console.clear();
        console.log(`You selected: ${groupNames[selectedIndex]}`);
        const selectedENV = envGroups?.groups?.find(
          (group) => group?.groupName === groupNames[selectedIndex]
        );
        await readAndWriteFile(selectedENV?.variables);
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

// Start CLI execution
startCLI();
