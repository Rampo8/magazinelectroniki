// backend/app/routes/Order.routes.js
const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");
router.get("/cart", OrderController.getCart);
router.post("/cart", OrderController.addToCart);
router.put("/cart/:itemId", OrderController.updateCartItem);
router.delete("/cart/:itemId", OrderController.removeFromCart);
router.post("/checkout", OrderController.checkout);
router.get("/", OrderController.getUserOrders);              
router.get("/:id", OrderController.getOrderById);           
router.patch("/:id/status", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);          

module.exports = router;