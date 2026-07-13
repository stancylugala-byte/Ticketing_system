require('dotenv').config();
const app = require('./src/app');
const db  = require('./src/models');

const PORT = process.env.PORT || 5000;

// alter: false — tables are stable; avoids FK constraint conflicts on startup
db.sequelize.sync({ alter: false })
  .then(() => {
    console.log('📦 Database synchronized successfully with MySQL via Sequelize.');
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database synchronization failed! Server shutting down...', err.message);
    process.exit(1);
  });
