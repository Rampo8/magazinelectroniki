// backend/app/models/Category.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Название категории обязательно' } }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    underscored: true
  });

  return Category;
};