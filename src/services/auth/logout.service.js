const redisClient = require('../../config/redis');
const jwt = require('jsonwebtoken');

async function logout(userId, accessToken) {
  const expiry = jwt.decode(accessToken).exp - Math.floor(Date.now() / 1000);
  await redisClient.set(`bl_${accessToken}`, 'true', { EX: expiry });
}

module.exports = logout;