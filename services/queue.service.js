const Bree = require("bree");
const Graceful = require("@ladjs/graceful");

const bree = new Bree({
  logger: false,
  jobs: [
    { name: "backupDaily", interval: "at 12:00 am" /*, timeout: "3s"*/ },
    { name: "backupMonthly", cron: "0 0 1 * *" },
  ],
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

exports.bree = bree;
