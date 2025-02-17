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

module.exports = fetchGitHubSession;
