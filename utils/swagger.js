const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("../config/config");

const swaggerDocs = (app, port) => {
  const swaggerSpec = swaggerJsdoc(config.swagger);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`>>>>> Docs available at http://localhost:${port}/docs `);
};

module.exports = swaggerDocs;
