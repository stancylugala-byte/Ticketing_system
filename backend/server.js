require('dotenv').config();
const app = require('./src/app');
const db  = require('./src/models');

const PORT = process.env.PORT || 5000;

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

async function startServer(attempt = 1) {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: false });
    console.log('📦 Database synchronized successfully with MySQL via Sequelize.');
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`❌ DB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
      setTimeout(() => startServer(attempt + 1), RETRY_DELAY);
    } else {
      console.error('❌ All retries exhausted. Server shutting down.');
      process.exit(1);
    }
  }
}

startServer();
