const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user.model');
const { generateTokens } = require('../../utils/auth.utils');
const { HTTP_STATUS } = require('../../utils/constants');

async function refreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid token' };
    }

    return generateTokens(user);
  } catch (error) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: 'Invalid token' };
  }
}

module.exports = refreshToken;