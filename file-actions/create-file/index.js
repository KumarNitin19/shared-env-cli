const fs = require("fs");

const createFile = (fileName) => {
  const createStream = fs.createWriteStream(".env.local");
  // createStream.end();
  return createStream;
};

module.exports = createFile;
