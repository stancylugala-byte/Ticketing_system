module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Pending', 'Resolved', 'Closed'),
      allowNull: false,
      defaultValue: 'Open'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      allowNull: false,
      defaultValue: 'Medium'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sla_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'tickets',
    timestamps: true,
    underscored: true
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User,           { foreignKey: 'user_id',    as: 'client' });
    Ticket.belongsTo(models.User,           { foreignKey: 'assigned_to', as: 'assignee' });
    Ticket.belongsTo(models.TicketCategory, { foreignKey: 'category_id', as: 'category' });
    Ticket.belongsTo(models.SlaPolicy,      { foreignKey: 'sla_id',      as: 'slaPolicy' });
    Ticket.hasMany(models.TicketComment,    { foreignKey: 'ticket_id',   as: 'comments' });
    Ticket.hasMany(models.Attachment,       { foreignKey: 'ticket_id',   as: 'attachments' });
    Ticket.hasOne(models.Feedback,          { foreignKey: 'ticket_id',   as: 'feedback' });
  };

  return Ticket;
};
