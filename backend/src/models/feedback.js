module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true // one feedback per ticket
    }
  }, {
    tableName: 'feedback',
    timestamps: false,
    underscored: true
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Feedback.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return Feedback;
};