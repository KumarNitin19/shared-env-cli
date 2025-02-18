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
    console.log(githubUsername);
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

module.exports = { fetchGitHubSession, checkWeatherFileExistsOrNot };
