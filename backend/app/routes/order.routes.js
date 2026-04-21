// backend/app/routes/Order.routes.js
const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");

// 🔹 1. СПЕЦИФИЧНЫЕ РОУТЫ (идут ПЕРВЫМИ!)
router.get("/cart", OrderController.getCart);
router.post("/cart", OrderController.addToCart);
router.put("/cart/:itemId", OrderController.updateCartItem);
router.delete("/cart/:itemId", OrderController.removeFromCart);
router.post("/checkout", OrderController.checkout);



module.exports = router;