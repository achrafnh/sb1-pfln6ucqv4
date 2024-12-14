module.exports = {
  register: require('./register.service'),
  login: require('./login.service'),
  refreshToken: require('./refresh.service'),
  logout: require('./logout.service')
};