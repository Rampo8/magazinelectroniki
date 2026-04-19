module.exports = app => {
  const controller = require("../backend/app/controllers/Categories.controller.js.js");
  const router = require("express").Router();

  // CRUD
  router.post("/", controller.create);
  router.get("/", controller.findAll);
  router.get("/:id", controller.findOne);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.delete("/", controller.deleteAll);

  // Нестандартные маршруты
  router.get("/search/name", controller.searchByName);
  router.get("/popular", controller.getPopularCategories);        // категории с наибольшим количеством товаров
  router.get("/with-products", controller.getCategoriesWithProductsCount);

  app.use("/api/categories", router);
};