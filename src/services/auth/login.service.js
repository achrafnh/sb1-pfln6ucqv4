const UserModel = require('../../models/user.model');
const { comparePasswords, generateTokens } = require('../../utils/auth.utils');
const { HTTP_STATUS } = require('../../utils/constants');

async function login(email, password) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
  }

  const isValidPassword = await comparePasswords(password, user.password_hash);
  if (!isValidPassword) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid credentials' };
  }

  await UserModel.updateLastLogin(user.id);
  return generateTokens(user);
}

module.exports = login;