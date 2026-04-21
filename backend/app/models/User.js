// backend/app/models/User.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Ассоциации (если нужны)
      // User.hasMany(models.Product, { foreignKey: 'user_id', as: 'products' });
    }
  }

  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {              // 🔹 НОВОЕ ПОЛЕ
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,       // Уникальный email
      validate: {
        isEmail: { msg: 'Введите корректный email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {              // 🔹 Город (уже есть, но проверим)
      type: DataTypes.STRING,
      allowNull: true
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    cart: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['email'] },   // Индекс для быстрого поиска
      { fields: ['phone'] }
    ]
  });

  return User;
};