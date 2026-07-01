module.exports = (sequelize, DataTypes) => {
  const TicketComment = sequelize.define('TicketComment', {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
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
      allowNull: false
    }
  }, {
    tableName: 'ticket_comments',
    timestamps: false, // Explicitly using 'created_at' to match ERD specifications
    underscored: true
  });

  TicketComment.associate = (models) => {
    TicketComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    TicketComment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return TicketComment;
};