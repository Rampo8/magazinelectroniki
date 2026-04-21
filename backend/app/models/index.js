const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.port || 5432,
    dialect: dbConfig.dialect,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ ВАЖНО: передаём Sequelize.DataTypes
const DataTypes = Sequelize.DataTypes;

// Подключаем модели
db.User = require("./User.js")(sequelize, DataTypes);
db.Category = require("./category.js")(sequelize, DataTypes);
db.Product = require("./product.js")(sequelize, DataTypes);
db.Order = require("./Order.js")(sequelize, DataTypes);
db.OrderItem = require("./OrderItem.js")(sequelize, DataTypes);

// Ассоциации
Object.keys(db).forEach(modelName => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

// 🔍 Для отладки — видно, что реально подключилось
console.log("📦 Загруженные модели:", Object.keys(db));

module.exports = db;