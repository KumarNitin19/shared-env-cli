const { fetchGitHubSession } = require("./git-actions/utils");

const fetchENVVariableForProject = async (projectId) => {
  try {
    const githubUserName = fetchGitHubSession();
    const resp = await fetch(
      `http:127.0.0.1:7000/cli/groups/${projectId}/${githubUserName}`
    );
    console.log(resp);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error : ", error);
  }
};

module.exports = fetchENVVariableForProject;
