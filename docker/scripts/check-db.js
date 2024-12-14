const mysql = require('mysql2/promise');
const logger = require('../../src/config/logger');

async function checkDatabase() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  };

  try {
    const connection = await mysql.createConnection(config);
    await connection.query('SELECT 1');
    await connection.end();
    logger.info('Database connection successful');
    process.exit(0);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
}

checkDatabase();