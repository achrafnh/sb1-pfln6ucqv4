const AuthService = require('../../services/auth.service');
const { validate } = require('../../utils/validation');
const { HTTP_STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

async function register(req, res, next) {
  try {
    const validatedData = validate.registration(req.body);
    const tokens = await AuthService.register(validatedData);
    res.status(HTTP_STATUS.CREATED).json(tokens);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
}

module.exports = register;