// app/models/clients.js
module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("client", {
    full_name: { 
      type: Sequelize.STRING, 
      allowNull: false 
    },
    phone_number: { 
      type: Sequelize.STRING 
    },
    email: { 
      type: Sequelize.STRING 
    },
    password: { 
      type: Sequelize.STRING 
    },
    address: { 
      type: Sequelize.STRING 
    },
    referred_by_id: { 
      type: Sequelize.INTEGER, 
      allowNull: true, 
      references: { model: 'clients', key: 'id' } 
    },
    // === НОВОЕ ПОЛЕ ДЛЯ БАЛАНСА ===
    balance: { 
      type: Sequelize.FLOAT, 
      allowNull: false, 
      defaultValue: 0.0 
    }
  }, {
    tableName: 'clients',
    timestamps: true,
    underscored: true
  });

  Client.associate = function(models) {
    Client.hasMany(models.address, { foreignKey: 'client_id', as: 'addresses' });
    Client.hasMany(models.order, { foreignKey: 'client_id', as: 'orders' });
    Client.hasMany(models.paymentMethod, { foreignKey: 'client_id', as: 'paymentMethods' });
    Client.hasMany(models.review, { foreignKey: 'client_id', as: 'reviews' });
  };

  return Client;
};