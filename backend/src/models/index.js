const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Load config
const configObj = require(path.join(__dirname, '../config/db.js'));
const config = configObj[env] || configObj;
const db = {};

// Create Sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host:           config.host,
      port:           config.port,
      dialect:        config.dialect,
      logging:        config.logging || false,
      dialectOptions: config.dialectOptions || {},
      pool:           config.pool || { max: 5, min: 0, acquire: 60000, idle: 10000 }
    }
  );
}

// Load models dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    try {
      const modelPath = path.join(__dirname, file);
      const modelModule = require(modelPath);

      if (typeof modelModule === 'function') {
        const model = modelModule(sequelize, DataTypes);
        if (model && model.name) {
          db[model.name] = model;
          console.log(`✅ Loaded model: ${model.name} from ${file}`);
        }
      } else {
        // If it's already a model
        const model = modelModule;
        if (model && model.name) {
          db[model.name] = model;
          console.log(`✅ Loaded model: ${model.name} from ${file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error loading model ${file}:`, error.message);
    }
  });

// Run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('📋 Loaded models:', Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));

module.exports = db;