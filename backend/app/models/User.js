// backend/app/models/User.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }

  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {             
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,       
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
    city: {              
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
      { fields: ['email'] },   
      { fields: ['phone'] }
    ]
  });

  return User;
};