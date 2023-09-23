const httpStatus = require("http-status");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const fsp = require("fs").promises;

const AppError = require("../utils/appError");

const mongoDumb = async () => {
  const time = new Date().toISOString();
  const dest = path.join(process.cwd(), "temp", time);

  await exec(`mongodump --db=tag  --out ${dest} --gzip`);
  await exec(`zip -j -r ${dest}.zip ${dest}`);
  fsp.rm(dest, { recursive: true, force: true });
  return `${dest}.zip`;
};

const mongoRestore = async (filePath) => {
  try {
    await exec(`unzip -q -d ${filePath.replace(/\.[^/.]+$/, "")} ${filePath}`);
    await exec(`mongorestore --quiet -d tag --gzip ${filePath.replace(/\.[^/.]+$/, "")}`);
    await fsp.unlink(filePath);
    await fsp.rm(filePath.replace(/\.[^/.]+$/, ""), { recursive: true, force: true });

    return true;
  } catch (error) {
    await fsp.unlink(filePath);
    await fsp.rm(filePath.replace(/\.[^/.]+$/, ""), { recursive: true, force: true });
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = { mongoRestore, mongoDumb };
