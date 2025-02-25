const { checkWeatherFileExistsOrNot } = require("../../git-actions/utils");
const createFile = require("../create-file");
const { readFileContent } = require("../read-file");

// adding entries to the file
const writeInFile = async (file, old_variables, new_variables) => {
  if (old_variables?.length) {
    old_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(
        `${new_variables?.length > 0 ? "//  " : ""} ${objKey}=${
          variable[objKey]
        }\n`
      );
    });
  }
  if (new_variables?.length) {
    if (old_variables?.length) {
      file.write("\n \n \n");
      file.write("// New Variables \n");
    }
    new_variables.map((variable) => {
      const objKey = Object.keys(variable)[0];
      file.write(`${objKey}=${variable[objKey]}\n`);
    });
    file.end();
  } else {
    console.log("No variables found");
  }
};

// creating/adding entries to the file
const readAndWriteFile = async (env_variables) => {
  const pathToFileOrDir = "../../.env.local";
  const fileName = ".env.local";
  const isFilePresent = checkWeatherFileExistsOrNot(pathToFileOrDir);
  await readFileContent(fileName);
  if (isFilePresent) {
    const variables = await readFileContent(fileName);
    const file = createFile(fileName);
    if (variables?.length) {
      writeInFile(file, variables, env_variables);
    } else writeInFile(file, [], env_variables);
  } else {
    const file = createFile(fileName);
    writeInFile(file, [], env_variables);
  }
};

module.exports = { writeInFile, readAndWriteFile };
