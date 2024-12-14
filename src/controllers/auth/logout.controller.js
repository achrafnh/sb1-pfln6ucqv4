const AuthService = require('../../services/auth.service');
const { HTTP_STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

async function logout(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await AuthService.logout(req.user.id, token);
    res.status(HTTP_STATUS.OK).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
}

module.exports = logout;