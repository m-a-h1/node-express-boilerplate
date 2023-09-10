const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: false, // TODO: must set to true on production,
    secure: !!req?.get("origin"), // if origin does not exist it means we are using postman, so turns the secure false
    sameSite: "none", // TODO: check it on production
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.usernameValidator = (username) => {
  // username should not contains whitespace
  if (username.length !== username.replace(/ /g, "").length) return false;

  const regex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  return regex.test(username);
};

exports.passwordValidator = (pass) => {
  // password should not contains whitespace
  if (pass.length !== pass.replace(/ /g, "").length) return false;
  return true;
};
