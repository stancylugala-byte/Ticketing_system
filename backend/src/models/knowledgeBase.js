const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const KnowledgeBase = sequelize.define('KnowledgeBase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'knowledge_bases',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return KnowledgeBase;
};