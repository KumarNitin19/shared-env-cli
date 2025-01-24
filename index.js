#!/usr/bin/env node

// const getData = async () => {
//   try {
//     const resp = await fetch("http:127.0.0.1:7000/cli/get-env-varaibles/");
//     const data = await resp.json();
//     return data;
//   } catch (error) {
//     console.log("Error : ", error);
//   }
// };

// getData();

// getENVData();

const readline = require("readline");

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
function startCLI() {
  const options = ["Dev", "Prod", "QA", "Hot-fix"];
  let selectedIndex = 0;

  // Generate a random color for each item
  const colorMap = options.map((_, index) => colors[index]);

  // Render the initial list
  renderList(options, selectedIndex, colorMap);

  // Set up keypress handling
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (_, key) => {
    if (key.name === "up") {
      selectedIndex =
        selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
      renderList(options, selectedIndex, colorMap);
    } else if (key.name === "down") {
      selectedIndex =
        selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
      renderList(options, selectedIndex, colorMap);
    } else if (key.name === "return") {
      console.clear();
      console.log(`You selected: ${options[selectedIndex]}`);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    } else if (key.ctrl && key.name === "c") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      console.log("\nExited.");
    }
  });
}

// Start the CLI tool
startCLI();

// Fetch user GitHub session
// const fetchGitHubSession = () => {
//   try {
//     const githubUsername = execSync("git config user.email").toString().trim();
//     if (!githubUsername) {
//       console.error("GitHub session not found. Please login via GitHub.");
//       process.exit(1);
//     }
//     return githubUsername;
//   } catch (error) {
//     console.error("Error fetching GitHub session:", error.message);
//     process.exit(1);
//   }
// };

// console.log(fetchGitHubSession());
