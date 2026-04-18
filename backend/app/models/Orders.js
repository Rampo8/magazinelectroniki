module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    client_id: { type: Sequelize.INTEGER, references: { model: 'clients', key: 'id' } },
    total_amount: { type: Sequelize.FLOAT, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false }
  }, {
    tableName: 'orders',
    timestamps: true,
    underscored: true
  });

  Order.associate = (models) => {
    Order.hasMany(models.orderItem, { foreignKey: 'order_id', as: 'orderItems' });
    Order.belongsTo(models.client, { foreignKey: 'client_id', as: 'client' });
  };

  return Order;
};