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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    postal_code: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    cart: {
      type: DataTypes.JSON,        // или DataTypes.JSONB для PostgreSQL
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  return User;
};