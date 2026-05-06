const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller.js");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API для управления товарами
 */

/**
 * @swagger
 * /products/{id}/buy:
 *   post:
 *     summary: Купить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно куплен
 *       404:
 *         description: Товар не найден
 */
router.post("/:id/buy", controller.buy);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *     responses:
 *       201:
 *         description: Товар успешно создан
 */
router.post("/", controller.create);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденный товар
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить товар
 *     tags: [Products]
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
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
router.delete("/:id", controller.delete);

module.exports = router;