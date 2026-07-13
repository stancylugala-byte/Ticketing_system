module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    attachment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'attachments',
    timestamps: false,
    underscored: true
  });

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.User,   { foreignKey: 'user_id',   as: 'uploader' });
    Attachment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return Attachment;
};
