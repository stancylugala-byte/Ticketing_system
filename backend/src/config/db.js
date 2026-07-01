require('dotenv').config();

module.exports = {
  // Uses your environment variable value, fallback defaults explicitly to "sts"
  database: process.env.DB_NAME || 'sts', 
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};