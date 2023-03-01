const validator = require("validator");

exports.objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

exports.password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message("password must contain at least 1 letter and 1 number");
  }
  return value;
};

exports.username = (value, helpers) => {
  if (!value.match(/[a-z][a-z0-9_]{3,30}$/)) {
    return helpers.message("username");
  }
  return value;
};

exports.phone = (value, helpers) => {
  if (validator.isMobilePhone(value)) return value;
  return helpers.message("please provide a valid phone number");
};
