const jwt = require('jsonwebtoken');
const { HTTP_STATUS } = require('../utils/constants');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'No token provided' };
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Token is invalid' };
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification error:', error);
    next({ status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid token' });
  }
};

exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next({
        status: HTTP_STATUS.FORBIDDEN,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};