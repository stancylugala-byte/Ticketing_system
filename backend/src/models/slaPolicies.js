module.exports = (sequelize, DataTypes) => {
  const SlaPolicy = sequelize.define('SlaPolicy', {
    sla_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      allowNull: false,
      unique: true
    },
    response_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resolution_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'sla_policies',
    timestamps: false
  });

  SlaPolicy.associate = (models) => {
    SlaPolicy.hasMany(models.Ticket, { foreignKey: 'sla_id', as: 'tickets' });
  };

  return SlaPolicy;
};
