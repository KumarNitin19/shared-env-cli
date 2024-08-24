const writeInFile = async (file) => {
  const dataToWrite = await getENVData();
  if (dataToWrite && dataToWrite[0].env_variables.length) {
    dataToWrite[0].env_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(`${objKey}=${variable[objKey]}`);
    });
    file.end();
  } else {
    throw new Error("Something went wrong!!");
  }
};

const readAndWriteFile = () => {
  const pathToFileOrDir = "./.env.local";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  if (isFilePresent) {
    readFileContent();
  } else {
    const fileName = ".env.local";
    const file = createFile(fileName);
    writeInFile(file);
  }
};

module.exports = { writeInFile, readAndWriteFile };
