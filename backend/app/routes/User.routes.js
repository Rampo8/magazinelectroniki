// backend/app/routes/User.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/User.controller.js");

// CRUD
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.delete("/", controller.deleteAll);

// 🔹 Авторизация
router.post("/login", controller.login);
module.exports = router;