// backend/app/routes/categories.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller.js");

// 🔹 CRUD
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.delete("/", controller.delete);

// 🔹 Нестандартные маршруты

// ✅ Экспортируем router (не функцию!)
module.exports = router;