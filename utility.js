const fs = require("fs");
const checkWeatherFileExistsOrNot = (pathToFileOrDir) => {
  if (fs.existsSync(pathToFileOrDir)) {
    return true;
  }
  return false;
};

module.exports = checkWeatherFileExistsOrNot;
