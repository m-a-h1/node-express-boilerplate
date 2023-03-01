const Joi = require("joi");
const { password, objectId, phone } = require("./custom.validation");

const signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required().custom(phone),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).required(),
  }),
};

const signIn = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

exports.forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

exports.resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).required(),
  }),

  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.updatePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")).required(),
  }),
};

exports.updateMe = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  signUp,
  signIn,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
