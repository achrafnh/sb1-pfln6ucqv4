const Joi = require('joi');
const { ROLES } = require('../../constants');

const registration = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid(ROLES.LAWYER, ROLES.CLIENT).required(),
  phone: Joi.string().pattern(/^\+?[\d\s-]+$/)
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refresh = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  registration,
  login,
  refresh
};