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
      defaultValue: 'Open'
    }
  });

  Ticket.associate = (models) => {
    // A Ticket belongs to a specific Client/User
    Ticket.belongsTo(models.User, { foreignKey: 'user_id', as: 'client' });
  };

  return Ticket;
};