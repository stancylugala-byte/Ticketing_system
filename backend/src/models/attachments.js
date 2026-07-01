module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    attachment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    // FIXED: Changed from INTEGER to UUID to match your primary User ID type
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    // FIXED: Changed from INTEGER to UUID to match your primary Ticket ID type
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'attachments',
    timestamps: false
  });

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Attachment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return Attachment;
};