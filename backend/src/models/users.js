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
    }
  });

  User.associate = (models) => {
    // A User can open many tickets
    User.hasMany(models.Ticket, { foreignKey: 'user_id', as: 'tickets' });
  };

  return User;
};