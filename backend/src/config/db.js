require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'Ticketing_system',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};