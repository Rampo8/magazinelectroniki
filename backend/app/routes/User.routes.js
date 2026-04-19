module.exports = app => {
  const controller = require("../controllers/Users.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               full_name:
   *                 type: string
   *               phone:
   *                 type: string
   *               postal_code:
   *                 type: string
   *               city:
   *                 type: string
   *               balance:
   *                 type: number
   *               cart:
   *                 type: array
   *                 items:
   *                   type: object
   *             example:
   *               full_name: "Иванов Иван Иванович"
   *               phone: "+79161234567"
   *               postal_code: "123456"
   *               city: "Москва"
   *               balance: 5000.50
   *               cart: []
   *     responses:
   *       201:
   *         description: User created
   *       500:
   *         description: Error creating user
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retrieve a list of all users
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   full_name:
   *                     type: string
   *                   phone:
   *                     type: string
   *                   postal_code:
   *                     type: string
   *                   city:
   *                     type: string
   *                   balance:
   *                     type: number
   *                   cart:
   *                     type: array
   *       500:
   *         description: Error retrieving users
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retrieve a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User found
   *       404:
   *         description: User not found
   *       500:
   *         description: Error retrieving user
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               full_name:
   *                 type: string
   *               phone:
   *                 type: string
   *               postal_code:
   *                 type: string
   *               city:
   *                 type: string
   *               balance:
   *                 type: number
   *               cart:
   *                 type: array
   *     responses:
   *       200:
   *         description: User updated
   *       404:
   *         description: User not found
   *       500:
   *         description: Error updating user
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted
   *       404:
   *         description: User not found
   *       500:
   *         description: Error deleting user
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /users:
   *   delete:
   *     summary: Delete all users
   *     responses:
   *       200:
   *         description: All users deleted
   *       500:
   *         description: Error deleting users
   */
  router.delete("/", controller.deleteAll);

  // ==================== НЕСТАНДАРТНЫЕ МАРШРУТЫ ====================

  /**
   * @swagger
   * /users/search/city:
   *   get:
   *     summary: Get users by city
   *     parameters:
   *       - in: query
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         description: City name
   *     responses:
   *       200:
   *         description: List of users in the city
   *       400:
   *         description: City parameter required
   *       500:
   *         description: Error retrieving users
   */
  router.get("/search/city", controller.getUsersByCity);

  /**
   * @swagger
   * /users/statistics/balance:
   *   get:
   *     summary: Get users balance statistics (total, average, max)
   *     responses:
   *       200:
   *         description: Balance statistics
   *       500:
   *         description: Error retrieving statistics
   */
  router.get("/statistics/balance", controller.getBalanceStatistics);

  /**
   * @swagger
   * /users/top-balance:
   *   get:
   *     summary: Get users with highest balance
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *     responses:
   *       200:
   *         description: Top users by balance
   *       500:
   *         description: Error retrieving top users
   */
  router.get("/top-balance", controller.getTopBalanceUsers);

  /**
   * @swagger
   * /users/search/phone:
   *   get:
   *     summary: Search users by phone number part
   *     parameters:
   *       - in: query
   *         name: phone
   *         required: true
   *         schema:
   *           type: string
   *         description: Part of phone number
   *     responses:
   *       200:
   *         description: List of matching users
   *       400:
   *         description: Phone parameter required
   *       500:
   *         description: Error searching users
   */
  router.get("/search/phone", controller.searchByPhonePart);

  /**
   * @swagger
   * /users/with-cart:
   *   get:
   *     summary: Get users who have items in cart
   *     responses:
   *       200:
   *         description: List of users with non-empty cart
   *       500:
   *         description: Error retrieving users
   */
  router.get("/with-cart", controller.getUsersWithCart);

  /**
   * @swagger
   * /users/without-cart:
   *   get:
   *     summary: Get users who have empty cart
   *     responses:
   *       200:
   *         description: List of users with empty cart
   *       500:
   *         description: Error retrieving users
   */
  router.get("/without-cart", controller.getUsersWithoutCart);

  /**
   * @swagger
   * /users/recent:
   *   get:
   *     summary: Get recently registered users
   *     responses:
   *       200:
   *         description: List of recent users
   *       500:
   *         description: Error retrieving recent users
   */
  router.get("/recent", controller.getRecentUsers);

  app.use("/api/users", router);
};