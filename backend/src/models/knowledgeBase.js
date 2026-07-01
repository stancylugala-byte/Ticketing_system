module.exports = (sequelize, DataTypes) => {
  const KnowledgeBase = sequelize.define('KnowledgeBase', {
    article_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    user_id: {
      type: DataTypes.UUID, // Tracks which Developer or SupportOfficer wrote the guide
      allowNull: false
    }
  }, {
    tableName: 'knowledge_base',
    timestamps: false,
    underscored: true
  });

  KnowledgeBase.associate = (models) => {
    KnowledgeBase.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return KnowledgeBase;
};