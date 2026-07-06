require('dotenv').config();
const app = require('./src/app');
// UPDATED: Points to the models folder inside the src directory
const db = require('./src/models'); 

const PORT = process.env.PORT || 5000;

// Execute Database Synchronization with MySQL before initializing server listener
// { alter: true } matches your Sequelize schema definitions to your live MySQL instances automatically
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('📦 Database synchronized successfully with MySQL via Sequelize.');
    
    // Fire up the network listener only after a verified storage connection handshake
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database synchronization failed! Server shutting down...', err);
    process.exit(1);
});