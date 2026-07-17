module.exports = (sequelize, DataTypes) => {
  const TicketComment = sequelize.define('TicketComment', {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'ticket_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  TicketComment.associate = (models) => {
    TicketComment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    TicketComment.belongsTo(models.User,   { foreignKey: 'user_id',   as: 'author' });
  };

  return TicketComment;
};
