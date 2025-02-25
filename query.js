const {
  fetchGitHubSession,
  startSpinner,
  stopSpinner,
} = require("./git-actions/utils");

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

module.exports = fetchENVVariableForProject;
