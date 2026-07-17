module.exports = (sequelize, DataTypes) => {
  const TicketCategory = sequelize.define('TicketCategory', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'ticket_categories',
    timestamps: false
  });

  TicketCategory.associate = (models) => {
    TicketCategory.hasMany(models.Ticket, { foreignKey: 'category_id', as: 'tickets' });
  };

  return TicketCategory;
};
