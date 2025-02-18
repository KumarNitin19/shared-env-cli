const fs = require("fs");

// creating a file
const createFile = (fileName) => {
  const createStream = fs.createWriteStream(fileName);
  return createStream;
};

module.exports = createFile;
