const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем базу данных
const db = require("./models");

// 🔍 Проверка окружения
console.log("NODE_ENV =", process.env.NODE_ENV);

// 🔍 Проверка конфигурации БД
console.log('📊 Имя БД:', db.sequelize.config.database);
console.log('👤 Пользователь:', db.sequelize.config.username);
console.log('🌐 Хост:', db.sequelize.config.host);
console.log('🔌 Порт:', db.sequelize.config.port);

// 🔌 Подключение к БД
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Подключение к PostgreSQL успешно!");
  })
  .catch(err => {
    console.error("❌ Ошибка подключения к базе:", err);
  });

// 🧠 ВАЖНО: всегда синхронизируем (для разработки)
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Все модели синхронизированы");
  })
  .catch(err => {
    console.error("❌ Ошибка синхронизации:", err);
  });

// 🔍 Проверяем, подгрузилась ли модель
console.log("📦 Модели:", Object.keys(db));

// Роуты
app.use("/api/users", require("./routes/User.routes.js"));
app.use("/api/categories", require("./routes/categories.routes.js"));
app.use("/api/products", require("./routes/product.routes.js"));

// Базовый маршрут
app.get("/", (req, res) => {
  res.json({ message: "Магазин электроники API работает!" });
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

module.exports = app;