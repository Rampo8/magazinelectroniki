const express = require("express");
const router = express.Router();

// 🔹 Проверь путь до контроллера (зависит от твоей структуры)
const controller = require("../controllers/product.controller.js");

// ⚠️ ВАЖНО: специфичные роуты идут ПЕРЕД CRUD
router.post("/:id/buy", controller.buy);  // ← Линия 7

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;