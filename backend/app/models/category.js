'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {   // ✅ ВАЖНО
        foreignKey: 'category_id',
        as: 'products'
      });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Category',   // ✅ лучше с большой буквы
    tableName: 'categories',
    timestamps: true,
    underscored: true
  });

  return Category;
};