const UserModel = require('../../models/user.model');
const { generateTokens } = require('../../utils/auth.utils');
const { HTTP_STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

async function register(userData) {
  const existingUser = await UserModel.findByEmail(userData.email);
  if (existingUser) {
    throw { status: HTTP_STATUS.CONFLICT, message: 'Email already registered' };
  }

  const userId = await UserModel.create(userData);
  const user = await UserModel.findById(userId);
  
  return generateTokens(user);
}

module.exports = register;