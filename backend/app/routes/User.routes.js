// backend/app/routes/User.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/User.controller.js");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Автогенерируемый ID пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         password:
 *           type: string
 *           format: password
 *           description: Пароль (только при создании/логине)
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT токен доступа
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации данных
 *       409:
 *         description: Пользователь с таким email уже существует
 */
router.post("/", controller.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Неавторизован
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Найденный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
router.get("/:id", controller.findOne);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить данные пользователя
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя по ID
 *     tags: [Users]
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
 *         description: Пользователь удалён
 *       404:
 *         description: Пользователь не найден
 */
router.delete("/:id", controller.delete);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Удалить всех пользователей (только админ)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Все пользователи удалены
 *       403:
 *         description: Недостаточно прав
 */
router.delete("/", controller.deleteAll);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Неверный email или пароль
 */
router.post("/login", controller.login);

module.exports = router;