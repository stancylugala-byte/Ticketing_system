module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticket_id: {
      type: DataTypes.UUID,   // char(36) — matches Ticket.id
      allowNull: false,
      unique: true            // one CSAT rating per ticket
    },
    user_id: {
      type: DataTypes.UUID,   // char(36) — matches User.id
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comments: {               // DB column is 'comments' (plural)
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'feedback',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    Feedback.belongsTo(models.User,   { foreignKey: 'user_id',   as: 'client' });
  };

  return Feedback;
};
