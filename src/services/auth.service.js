const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const redisClient = require('../config/redis');
const { HTTP_STATUS } = require('../utils/constants');

class AuthService {
  static async register(userData) {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw { status: HTTP_STATUS.CONFLICT, message: 'Email already registered' };
    }

    const userId = await UserModel.create(userData);
    const user = await UserModel.findById(userId);
    
    return this.generateTokens(user);
  }

  static async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
    }

    await UserModel.updateLastLogin(user.id);
    return this.generateTokens(user);
  }

  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid token' };
      }

      return this.generateTokens(user);
    } catch (error) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid token' };
    }
  }

  static async logout(userId, accessToken) {
    const expiry = jwt.decode(accessToken).exp - Math.floor(Date.now() / 1000);
    await redisClient.set(`bl_${accessToken}`, 'true', { EX: expiry });
  }

  static generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}