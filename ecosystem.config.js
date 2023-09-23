module.exports = {
  apps: [
    {
      name: "avanteka-backend",
      script: "node server.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
