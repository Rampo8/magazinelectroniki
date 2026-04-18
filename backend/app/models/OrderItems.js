module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("order_item", {
    order_id: { type: Sequelize.INTEGER, references: { model: 'orders', key: 'id' } },
    product_id: { type: Sequelize.INTEGER, references: { model: 'products', key: 'id' } },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false }
  }, {
    tableName: 'order_items',
    timestamps: true,
    underscored: true
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.order, { foreignKey: 'order_id', as: 'order' });
    OrderItem.belongsTo(models.product, { foreignKey: 'product_id', as: 'product' });
  };

  return OrderItem;
};