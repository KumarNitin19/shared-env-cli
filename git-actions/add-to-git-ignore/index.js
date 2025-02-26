const { readGitFile } = require("../../file-actions/read-file");

// add env file to .gitignore
const addToGitIgnore = async () => {
  const fileName = ".gitignore";
  const fileContent = await readGitFile();
  if (fileContent.includes(fileName)) return;
  fs.appendFile(fileName, "\n.env", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

module.exports = addToGitIgnore;
