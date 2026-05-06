// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к БД
const db = require("./models");

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log('📊 Имя БД:', db.sequelize.config.database);
console.log('👤 Пользователь:', db.sequelize.config.username);
console.log('🌐 Хост:', db.sequelize.config.host);
console.log('🔌 Порт:', db.sequelize.config.port);

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Подключение к PostgreSQL успешно!");
  })
  .catch(err => {
    console.error("❌ Ошибка подключения к базе:", err);
  });

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Все модели синхронизированы");
  })
  .catch(err => {
    console.error("❌ Ошибка синхронизации:", err);
  });

console.log("📦 Модели:", Object.keys(db));

// ✅ Swagger configuration — ДО app.listen()
const PORT = process.env.PORT || 8080;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trade-APP API',
      version: '1.0.0',
      description: 'API documentation for electronics store',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    // ✅ Обязательно: components должен существовать, чтобы не было ошибки "reading 'schemas'"
    components: {
      schemas: {}, // swagger-jsdoc сам добавит схемы из JSDoc-комментариев
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите токен в формате: Bearer <ваш_JWT_токен>',
        },
      },
    },
  },
  // ✅ Пути к файлам с JSDoc-комментариями (относительно backend/server.js)
  apis: [
    './routes/*.js',
    // './app/controllers/*.js', // раскомментируйте, если есть @swagger в контроллерах
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Роуты — пути должны совпадать с тем, что указано в @swagger в файлах роутов
app.use("/api/users", require("./routes/User.routes.js"));    
app.use("/api/categories", require("./routes/categories.routes.js"));
app.use("/api/products", require("./routes/product.routes.js"));
app.use("/api/orders", require("./routes/order.routes.js"));
app.use("/api/orderitem", require("./routes/OrderItem.routes.js"));

// Базовый маршрут
app.get("/", (req, res) => {
  res.json({ 
    message: "Магазин электроники API работает!",
    docs: `http://localhost:${PORT}/api-docs`
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err);
  res.status(err.status || 500).json({
    message: err.message || "Внутренняя ошибка сервера",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ✅ Запуск сервера — в самом конце
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = app;