const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in-progress", "completed").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
};
