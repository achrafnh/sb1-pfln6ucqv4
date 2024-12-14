const AuthService = require('../../services/auth.service');
const { HTTP_STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const tokens = await AuthService.login(email, password);
    res.status(HTTP_STATUS.OK).json(tokens);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
}

module.exports = login;