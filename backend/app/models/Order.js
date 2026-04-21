// backend/app/models/Order.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'items',
        onDelete: 'CASCADE'
      });
    }
  }

  Order.init({
    status: {
      type: DataTypes.STRING,
      defaultValue: 'new',
      allowNull: false
      // Варианты: 'new', 'processing', 'shipped', 'completed', 'cancelled'
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true
  });

  return Order;
};