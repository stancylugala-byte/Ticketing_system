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
    // FK: which category this ticket belongs to
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // FK: which SLA policy applies based on priority
    sla_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // FK: the support agent (SupportOfficer/Developer) assigned to this ticket
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true
    },
    // FK: the client who opened the ticket
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'tickets',
    timestamps: true,        // createdAt + updatedAt tracked automatically
    underscored: true        // maps camelCase to snake_case column names
  });

  Ticket.associate = (models) => {
    // Client who opened the ticket
    Ticket.belongsTo(models.User, { foreignKey: 'user_id', as: 'client' });

    // Agent assigned to handle the ticket
    Ticket.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignee' });

    // Category this ticket falls under
    Ticket.belongsTo(models.TicketCategory, { foreignKey: 'category_id', as: 'category' });

    // SLA policy tied to this ticket
    Ticket.belongsTo(models.SlaPolicy, { foreignKey: 'sla_id', as: 'slaPolicy' });

    // Comments on this ticket
    Ticket.hasMany(models.TicketComment, { foreignKey: 'ticket_id', as: 'comments' });

    // Attachments on this ticket
    Ticket.hasMany(models.Attachment, { foreignKey: 'ticket_id', as: 'attachments' });

    // Feedback left after resolution
    Ticket.hasOne(models.Feedback, { foreignKey: 'ticket_id', as: 'feedback' });
  };

  return Ticket;
};