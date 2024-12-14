const http = require('http');
const logger = require('./src/config/logger');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  timeout: 2000,
  path: '/health'
};

const request = http.request(options, (res) => {
  logger.info(`Health check status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  logger.error('Health check failed:', err);
  process.exit(1);
});

request.end();