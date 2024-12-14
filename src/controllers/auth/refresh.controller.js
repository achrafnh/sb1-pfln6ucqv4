const AuthService = require('../../services/auth.service');
const { HTTP_STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    res.status(HTTP_STATUS.OK).json(tokens);
  } catch (error) {
    logger.error('Token refresh error:', error);
    next(error);
  }
}

module.exports = refresh;