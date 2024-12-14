const schemas = require('./schemas/auth.schema');
const { HTTP_STATUS } = require('../constants');

function validateSchema(schema) {
  return (data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      throw { status: HTTP_STATUS.BAD_REQUEST, errors };
    }
    return value;
  };
}

module.exports = {
  validate: {
    registration: validateSchema(schemas.registration),
    login: validateSchema(schemas.login),
    refresh: validateSchema(schemas.refresh)
  }
};