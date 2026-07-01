const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Load the exact config file found in your src/config directory
const configObj = require(path.join(__dirname, '../config/db.js'));

// If your db.js uses nested environments (e.g. config.development), pick the active one;
// otherwise fall back directly to the flat object itself
const config = configObj[env] || configObj;
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // FIXED: Pass the config object as a direct structural instantiation argument
  // This cleanly supports both a nested multi-env setup or a flat parameters structure
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1. Dynamically read the models folder and import each model file automatically
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
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 2. Run the association rule hooks for every model file found to generate foreign keys
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach the active instances to the export layer object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;