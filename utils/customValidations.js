const validator = require("validator");
const { usernameValidator } = require("./general");

exports.objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

exports.password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password should have at least 8 character");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password should contained at least one letter and one number"
    );
  }
  return value;
};

exports.username = (value, helpers) => {
  if (!usernameValidator(value)) {
    return helpers.message("username");
  }
  return value;
};

exports.phone = (value, helpers) => {
  if (validator.isMobilePhone(value)) return value;
  return helpers.message("please enter a valid phone number");
};
