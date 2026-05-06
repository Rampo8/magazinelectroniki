// backend/app/routes/Order.routes.js
const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API для управления заказами и корзиной
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: ID товара
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         variant:
 *           type: object
 *           properties:
 *             size: { type: string }
 *             color: { type: string }
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID или название товара
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         subtotal:
 *           type: number
 *           format: float
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *           default: pending
 *         shippingAddress:
 *           type: object
 *           properties:
 *             street: { type: string }
 *             city: { type: string }
 *             postalCode: { type: string }
 *             country: { type: string }
 *         paymentMethod:
 *           type: string
 *           enum: [card, cash, paypal]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CheckoutRequest:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         shippingAddress:
 *           type: object
 *           required: [street, city, postalCode, country]
 *           properties:
 *             street: { type: string }
 *             city: { type: string }
 *             postalCode: { type: string }
 *             country: { type: string }
 *         paymentMethod:
 *           type: string
 *           enum: [card, cash, paypal]
 *         note:
 *           type: string
 *           description: Комментарий к заказу
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 */

/**
 * @swagger
 * /orders/cart:
 *   get:
 *     summary: Получить содержимое корзины
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров в корзине
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *                 total:
 *                   type: number
 *       401:
 *         description: Неавторизован
 */
router.get("/cart", OrderController.getCart);

/**
 * @swagger
 * /orders/cart:
 *   post:
 *     summary: Добавить товар в корзину
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Товар добавлен в корзину
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 cart:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неавторизован
 */
router.post("/cart", OrderController.addToCart);

/**
 * @swagger
 * /orders/cart/{itemId}:
 *   put:
 *     summary: Обновить количество товара в корзине
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID элемента корзины
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Корзина обновлена
 *       404:
 *         description: Элемент не найден в корзине
 */
router.put("/cart/:itemId", OrderController.updateCartItem);

/**
 * @swagger
 * /orders/cart/{itemId}:
 *   delete:
 *     summary: Удалить товар из корзины
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён из корзины
 *       404:
 *         description: Элемент не найден
 */
router.delete("/cart/:itemId", OrderController.removeFromCart);

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Оформить заказ (чекаут)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Корзина пуста или ошибка данных
 *       401:
 *         description: Неавторизован
 */
router.post("/checkout", OrderController.checkout);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Получить все заказы текущего пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", OrderController.getUserOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденный заказ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден
 */
router.get("/:id", OrderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Обновить статус заказа (только админ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Статус заказа обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Заказ не найден
 */
router.patch("/:id/status", OrderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Удалить заказ (только админ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Заказ удалён
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Заказ не найден
 */
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;