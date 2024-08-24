const addToGitIgnore = async () => {
  const pathToFileOrDir = "./.gitignore";
  const fileName = ".gitignore";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  if (isFilePresent) {
    const fileContent = await readGitFle();
    if (fileContent.includes(fileName)) return;
    fs.appendFile(fileName, "\n.env.local", function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }
};

module.exports = addToGitIgnore;
