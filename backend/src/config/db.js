require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'sts',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',    // matches DB_PASS in .env
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};