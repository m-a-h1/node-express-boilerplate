const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const httpStatus = require("http-status");
const { authpermition } = require("../../services");

require("dotenv").config();
const ManagerAuth = (roleName, subPerm) =>
  catchAsync(async (req, res, next) => {
    try {
      const UserID = jwt.verify(req.headers["x-auth"], process.env.JWT_SECRET);
      console.log(UserID);
      const result = await authpermition.L0Manager(roleName, UserID.sub, subPerm, !subPerm);
      req.User = result;
      return next();
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "you dont have permition");
    }
  });

module.exports = {
  ManagerAuth,
};
