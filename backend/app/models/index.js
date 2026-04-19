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
      underscored: true,     // snake_case для полей (created_at и т.д.)
      freezeTableName: false // важно: Sequelize будет использовать множественное число или имя из модели
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

// Подключаем существующие модели
db.user      = require("./User.js")(sequelize, Sequelize);
db.category  = require("./category.js")(sequelize, Sequelize);
db.product   = require("./product.js")(sequelize, Sequelize);

// Здесь позже добавишь остальные модели, когда создашь файлы:
// db.order = require("./order.js")(sequelize, Sequelize);
// db.orderItem = require("./orderItem.js")(sequelize, Sequelize);
// и т.д.

// === Ассоциации (связи между моделями) ===
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;