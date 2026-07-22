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
      allowNull: true   // null for OAuth users
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('Client', 'SupportOfficer', 'Developer', 'Manager', 'Admin'),
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
    User.hasMany(models.Ticket,        { foreignKey: 'user_id',     as: 'tickets' });
    User.hasMany(models.Ticket,        { foreignKey: 'assigned_to', as: 'assignedTickets' });
    User.hasMany(models.TicketComment, { foreignKey: 'user_id',     as: 'comments' });
    User.hasMany(models.Attachment,    { foreignKey: 'user_id',     as: 'attachments' });
    User.hasMany(models.Notification,  { foreignKey: 'user_id',     as: 'notifications' });
    User.hasMany(models.Feedback,      { foreignKey: 'user_id',     as: 'feedbacks' });
    User.hasMany(models.KnowledgeBase, { foreignKey: 'user_id',     as: 'articles' });
  };

  return User;
};
