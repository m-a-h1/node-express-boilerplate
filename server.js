const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose.set("strictQuery", false);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: ".env" });
const app = require("./app");
const config = require("./config/config");

const DB = config.mongoose.url;

mongoose.connect(DB, config.mongoose.options).then(() => console.log("DB connection successful!"));

const server = app.listen(config.port, () => {
  console.log(`App running on port ${config.port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
