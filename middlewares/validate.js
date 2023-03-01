const Joi = require("joi");
const httpStatus = require("http-status");
const { pick } = require("lodash");
const AppError = require("../utils/appError");

exports.validate = (schema) => (req, res, next) => {
  // fix schema
  const selectedSchema = typeof schema === "function" ? schema(req) : schema;
  const arraySchema = Array.isArray(selectedSchema) ? selectedSchema : [selectedSchema];
  for (let i = 0; i < arraySchema.length; i++) {
    const validSchema = pick(arraySchema[i], ["params", "query", "body", "headers", "form-data"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({
        errors: {
          label: "key",
        },
      })
      .validate(object);

    if (error) {
      console.log(error);
      const errorMessage = error.details.map((details) => details.message).join(", ");
      return next(new AppError(errorMessage, httpStatus.BAD_REQUEST));
    }
    Object.assign(req, value);
  }
  return next();
};
