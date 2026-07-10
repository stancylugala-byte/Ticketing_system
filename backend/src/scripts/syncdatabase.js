require('dotenv').config();
const { sequelize } = require('../config/sequelize');
const { DataTypes } = require('sequelize');

// ✅ CORRECT: Call model functions with sequelize and DataTypes
const User = require('../models/user')(sequelize, DataTypes);
const Ticket = require('../models/ticket')(sequelize, DataTypes);
const TicketComment = require('../models/ticketComments')(sequelize, DataTypes);
const TicketCategory = require('../models/ticketCategories')(sequelize, DataTypes);
const Attachment = require('../models/attachment')(sequelize, DataTypes);
const Feedback = require('../models/feedback')(sequelize, DataTypes);
const KnowledgeBase = require('../models/knowledgeBase')(sequelize, DataTypes);
const Notification = require('../models/notifications')(sequelize, DataTypes);
const SlaPolicy = require('../models/slaPolicies')(sequelize, DataTypes);

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // ✅ Check if models are registered
    console.log('📋 Registered models:', Object.keys(sequelize.models));

    // ✅ Force sync
    await sequelize.sync({ force: true });
    console.log('✅ Tables created successfully!');

    // ✅ List tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📋 Tables in database:');
    if (results.length === 0) {
      console.log('  (No tables found)');
    } else {
      results.forEach(row => {
        console.log('  -', Object.values(row)[0]);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

syncDatabase();