const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const activeChecker = catchAsync(async (req, res, next) => {
  if (req.User.active === false) {
    throw new ApiError(httpStatus.FORBIDDEN, "your account disabled");
  }
  next();
});
module.exports = { activeChecker };
