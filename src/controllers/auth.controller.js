const AuthService = require('../services/auth.service');
const { validate, schemas } = require('../utils/validation');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

class AuthController {
  static async register(req, res, next) {
    try {
      const validatedData = validate(schemas.registration)(req.body);
      const tokens = await AuthService.register(validatedData);
      
      res.status(HTTP_STATUS.CREATED).json(tokens);
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      
      res.status(HTTP_STATUS.OK).json(tokens);
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      
      res.status(HTTP_STATUS.OK).json(tokens);
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      await AuthService.logout(req.user.id, token);
      
      res.status(HTTP_STATUS.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }
}