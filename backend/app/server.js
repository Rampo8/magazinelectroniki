const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();   // загружаем .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем базу данных
const db = require("./models/index.js");   // ← Важно: правильный путь

// Тест подключения к БД (по желанию)
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Подключение к PostgreSQL успешно!");
  })
  .catch(err => {
    console.error("❌ Ошибка подключения к базе:", err);
  });

// Синхронизация моделей (только для разработки!)
// В продакшене лучше использовать миграции (Sequelize CLI)
if (process.env.NODE_ENV === "development") {
  db.sequelize.sync({ alter: true })   // или force: true (осторожно — удаляет данные!)
    .then(() => {
      console.log("✅ Все модели синхронизированы");
    })
    .catch(err => console.log("Ошибка синхронизации:", err));
}

// Подключаем роуты (примеры)
app.use("/api/users", require("./routes/User.routes.js"));        // если есть
app.use("/api/categories", require("./routes/categories.routes"));
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