
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Здесь можно добавить связи позже, например:
      // Product.belongsToMany(models.User, { through: 'carts', as: 'users' });
      // или связь с заказом и т.д.
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'product',
    tableName: 'products',
    timestamps: true,
    underscored: true
  });

  return Product;
};