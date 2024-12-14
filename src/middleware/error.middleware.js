const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error:', err);

  // Handle validation errors
  if (err.errors) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      errors: err.errors
    });
  }

  // Handle known errors
  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle unknown errors
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error'
  });
};