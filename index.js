#!/usr/bin/env node
const readline = require("readline");
const fetchENVVariableForProject = require("./query");
const { readAndWriteFile } = require("./file-actions/write-file");
const { fetchGitHubSession } = require("./git-actions/utils");

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
async function startCLI() {
  let selectedIndex = 0;
  const projectId = "0c515a83-2d3c-4ce1-8ba4-a8a2550faf73";
  const envGroups = await fetchENVVariableForProject(projectId);
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

fetchGitHubSession();
// Start the CLI tool
startCLI();
