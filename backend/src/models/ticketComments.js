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
    },
    // true = internal note (only visible to support staff), false = public reply to client
    is_internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'ticket_comments',
    timestamps: false,
    underscored: true
  });

  TicketComment.associate = (models) => {
    TicketComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    TicketComment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return TicketComment;
};