const express = require("express");
const userRoutes = require("./user.routes");
const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
