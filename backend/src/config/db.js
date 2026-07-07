require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'sts',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};
