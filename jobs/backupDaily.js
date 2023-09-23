const moment = require("moment");
const fsp = require("fs").promises;
const { backupServices, s3Services } = require("../services");

(async () => {
  const backupPath = await backupServices.mongoDumb();
  await s3Services.uploadFilePrivate(backupPath, "daily");
  await fsp.unlink(backupPath);

  const response = await s3Services.getListPrivate();
  const backupLists = response.Contents;

  const aWeekAgo = moment().add(-7, "days");

  if (backupLists)
    for (let i = 0; i < backupLists.length; i++) {
      const fileName = backupLists[i].Key.split("/").pop().split(".")[0];
      if (new Date(fileName) < aWeekAgo) await s3Services.removeFilePrivate(backupLists[i].Key);
    }
})();
