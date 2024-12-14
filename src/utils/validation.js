const Joi = require('joi');
const { ROLES } = require('./constants');

const schemas = {
  registration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(ROLES.LAWYER, ROLES.CLIENT).required(),
    phone: Joi.string().pattern(/^\+?[\d\s-]+$/)
  }),

  lawyerProfile: Joi.object({
    barNumber: Joi.string().required(),
    barAssociation: Joi.string().required(),
    lawFirmName: Joi.string(),
    specialties: Joi.array().items(Joi.string()).min(1).required(),
    consultationPrice: Joi.number().min(0),
    yearsOfExperience: Joi.number().integer().min(0),
    languages: Joi.array().items(Joi.string())
  }),

  consultation: Joi.object({
    lawyerId: Joi.number().required(),
    description: Joi.string().required().min(10),
    preferredDates: Joi.array().items(Joi.date().greater('now')).min(1),
    preferredContactMethod: Joi.string().valid('email', 'phone', 'video').required()
  })
};

const validate = (schema) => {
  return (data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      throw { status: 400, errors };
    }
    return value;
  };
};

module.exports = {
  validate,
  schemas
};