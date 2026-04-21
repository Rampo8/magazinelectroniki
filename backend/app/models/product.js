// backend/app/models/Product.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Product.hasMany(models.OrderItem, {
        foreignKey: 'product_id',
        as: 'order_items',
        onDelete: 'RESTRICT'
      });
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Название обязательно' } }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'Цена не может быть отрицательной' } }
    },
    characteristics: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'Остаток не может быть отрицательным' } }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
    freezeTableName: false
  });

  return Product;
};