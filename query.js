const fetchENVVariableForProject = async (projectId) => {
  try {
    const resp = await fetch(`http:127.0.0.1:7000/api/v1/groups/${projectId}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error : ", error);
  }
};

module.exports = fetchENVVariableForProject;
