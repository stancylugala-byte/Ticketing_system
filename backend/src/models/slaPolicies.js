const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const SlaPolicy = sequelize.define('SlaPolicy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_time_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 24
    },
    resolution_time_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 72
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Medium'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'sla_policies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SlaPolicy;
};