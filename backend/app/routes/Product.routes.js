module.exports = app => {
  const controller = require("../controllers/Products.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               category:
   *                 type: string
   *               quantity:
   *                 type: integer
   *             example:
   *               name: "Смартфон Xiaomi Redmi Note 12"
   *               description: "Отличный смартфон с хорошей камерой"
   *               price: 18999.99
   *               category: "Смартфоны"
   *               quantity: 45
   *     responses:
   *       201:
   *         description: Product created
   *       500:
   *         description: Error creating product
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Retrieve a list of all products
   *     responses:
   *       200:
   *         description: A list of products
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Retrieve a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product found
   *       404:
   *         description: Product not found
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name: { type: string }
   *               description: { type: string }
   *               price: { type: number }
   *               category: { type: string }
   *               quantity: { type: integer }
   *     responses:
   *       200:
   *         description: Product updated
   *       404:
   *         description: Product not found
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /products:
   *   delete:
   *     summary: Delete all products
   *     responses:
   *       200:
   *         description: All products deleted
   */
  router.delete("/", controller.deleteAll);

  // ==================== НЕСТАНДАРТНЫЕ МАРШРУТЫ ====================

  /**
   * @swagger
   * /products/search/name:
   *   get:
   *     summary: Search products by name (partial match)
   *     parameters:
   *       - in: query
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of matching products
   *       400:
   *         description: Name parameter required
   */
  router.get("/search/name", controller.searchByName);

  /**
   * @swagger
   * /products/category:
   *   get:
   *     summary: Get products by category
   *     parameters:
   *       - in: query
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of products in category
   *       400:
   *         description: Category parameter required
   */
  router.get("/category", controller.getByCategory);

  /**
   * @swagger
   * /products/low-stock:
   *   get:
   *     summary: Get products with low stock (quantity < 10)
   *     responses:
   *       200:
   *         description: List of low stock products
   */
  router.get("/low-stock", controller.getLowStockProducts);

  /**
   * @swagger
   * /products/in-stock:
   *   get:
   *     summary: Get products that are in stock (quantity > 0)
   *     responses:
   *       200:
   *         description: List of products in stock
   */
  router.get("/in-stock", controller.getInStockProducts);

  /**
   * @swagger
   * /products/statistics/category:
   *   get:
   *     summary: Get statistics by category (count and average price)
   *     responses:
   *       200:
   *         description: Category statistics
   */
  router.get("/statistics/category", controller.getCategoryStatistics);

  /**
   * @swagger
   * /products/top-expensive:
   *   get:
   *     summary: Get most expensive products
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *     responses:
   *       200:
   *         description: Top expensive products
   */
  router.get("/top-expensive", controller.getTopExpensiveProducts);

  /**
   * @swagger
   * /products/recent:
   *   get:
   *     summary: Get recently added products
   *     responses:
   *       200:
   *         description: List of recent products
   */
  router.get("/recent", controller.getRecentProducts);

  app.use("/api/products", router);
};