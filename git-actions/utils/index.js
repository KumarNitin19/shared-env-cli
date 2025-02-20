const fs = require("fs");
const path = require("path");

const { execSync } = require("child_process");
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

const checkWeatherFileExistsOrNot = (pathname) => {
  const filePath = path.join(__dirname, pathname); // Change to the file you want to check

  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
};

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerIndex = 0;

const blue = "\x1b[34m"; // Blue color
const reset = "\x1b[0m"; // Reset color
const clearLine = "\x1b[2K"; // Clears the current line
const moveCursorToStart = "\r";

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

const stopSpinner = (spinner, message, isSuccess = true) => {
  clearInterval(spinner);
  process.stdout.write(`${moveCursorToStart}${clearLine}`); // Clear the spinner line
  console.log(`${isSuccess ? "✅" : "❌"} ${message}\n`); // Print success/failure message
  process.stdout.write("\x1B[?25h"); // Show cursor
};

module.exports = {
  fetchGitHubSession,
  checkWeatherFileExistsOrNot,
  startSpinner,
  stopSpinner,
};
