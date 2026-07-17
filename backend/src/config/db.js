module.exports = {
  database: process.env.DB_NAME     || 'sts',
  username: process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '@1234',
  host:     process.env.DB_HOST     || '127.0.0.1',
  port:     parseInt(process.env.DB_PORT || '3306', 10),
  dialect:  'mysql',
  logging:  process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};
