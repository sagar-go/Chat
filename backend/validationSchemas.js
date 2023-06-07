const Joi = require("@hapi/joi");

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  name: Joi.string().required(),
  manager: Joi.string(),
});

const loginSchema2 = Joi.object({
  userName: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { signUpSchema, loginSchema2 };
