module.exports = (sequelize, DataTypes) => {
  const KnowledgeBase = sequelize.define('KnowledgeBase', {
    article_id: {
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'knowledge_base',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  KnowledgeBase.associate = (models) => {
    KnowledgeBase.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return KnowledgeBase;
};
