const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller.js");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API для управления категориями
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Создать категорию
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               slug: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       201: { description: Категория создана }
 *       400: { description: Ошибка валидации }
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Найденная категория }
 *       404: { description: Категория не найдена }
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Обновить категорию
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Категория обновлена }
 *       404: { description: Категория не найдена }
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Удалить категорию по ID
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Категория удалена }
 *       404: { description: Категория не найдена }
 */
router.delete("/:id", controller.deleteOne); // ✅ Теперь вызываем deleteOne

/**
 * @swagger
 * /api/categories:
 *   delete:
 *     summary: Удалить все категории (админ)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Все категории удалены }
 *       403: { description: Недостаточно прав }
 */
router.delete("/", controller.deleteAll); // ✅ Вызываем отдельный метод

module.exports = router;