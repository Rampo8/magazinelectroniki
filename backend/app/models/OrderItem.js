// backend/app/models/OrderItem.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
        onDelete: 'CASCADE'
      });
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'RESTRICT'
      });
    }
  }

  OrderItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: 'Количество должно быть больше 0' } }
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'Цена не может быть отрицательной' } }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
    underscored: true
  });

  return OrderItem;
};