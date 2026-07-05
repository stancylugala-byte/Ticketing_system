module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Client', 'SupportOfficer', 'Developer', 'Admin'),
      allowNull: false,
      defaultValue: 'Client'
    },
    reset_token: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  User.associate = (models) => {
    // Tickets opened by this user (as a client)
    User.hasMany(models.Ticket, { foreignKey: 'user_id', as: 'tickets' });

    // Tickets assigned to this user (as an agent)
    User.hasMany(models.Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets' });

    // Comments posted by this user
    User.hasMany(models.TicketComment, { foreignKey: 'user_id', as: 'comments' });

    // Attachments uploaded by this user
    User.hasMany(models.Attachment, { foreignKey: 'user_id', as: 'attachments' });

    // Notifications sent to this user
    User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });

    // Feedback submitted by this user
    User.hasMany(models.Feedback, { foreignKey: 'user_id', as: 'feedbacks' });

    // Knowledge base articles authored by this user
    User.hasMany(models.KnowledgeBase, { foreignKey: 'user_id', as: 'articles' });
  };

  return User;
};