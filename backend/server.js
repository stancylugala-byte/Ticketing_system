require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/sequelize');

// ✅ Import models to register them
require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // ✅ FORCE: Drop and recreate ALL tables
    console.log('⚠️ Recreating all tables with force:true...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables synchronized');

    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📋 Tables in database:');
    results.forEach(row => {
      console.log('  -', Object.values(row)[0]);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();