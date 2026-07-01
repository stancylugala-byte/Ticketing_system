module.exports = (sequelize, DataTypes) => {
  const TicketCategory = sequelize.define('TicketCategory', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'ticket_categories',
    timestamps: false // No need for dynamic timestamps on basic lookup table
  });

  TicketCategory.associate = (models) => {
    TicketCategory.hasMany(models.Ticket, { foreignKey: 'category_id', as: 'tickets' });
  };

  return TicketCategory;
};