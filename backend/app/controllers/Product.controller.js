const db = require("../models");
const { QueryTypes } = require('sequelize');
const Product = db.product;

exports.create = async (req, res) => {
    try {
        const data = await Product.create(req.body);
        res.status(201).send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Product.findAll();
        res.send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Product.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.update = async (req, res) => {
    try {
        const result = await Product.update(req.body, { where: { id: req.params.id } });
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Product.destroy({ where: { id: req.params.id } });
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Product.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

// ==================== НЕСТАНДАРТНЫЕ ЗАПРОСЫ (7 методов с raw SQL) ====================

// 1. Поиск товаров по названию (частичное совпадение)
exports.searchByName = async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).send({ message: "Name parameter is required" });

    const products = await db.sequelize.query(
      'SELECT * FROM products WHERE name ILIKE :namePattern',
      {
        replacements: { namePattern: `%${name}%` },
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 2. Получить товары по категории
exports.getByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) return res.status(400).send({ message: "Category parameter is required" });

    const products = await db.sequelize.query(
      'SELECT * FROM products WHERE category ILIKE :categoryPattern',
      {
        replacements: { categoryPattern: `%${category}%` },
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 3. Товары с низким остатком (меньше 10 штук)
exports.getLowStockProducts = async (_req, res) => {
  try {
    const products = await db.sequelize.query(
      'SELECT * FROM products WHERE quantity < 10 ORDER BY quantity ASC',
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 4. Товары в наличии (quantity > 0)
exports.getInStockProducts = async (_req, res) => {
  try {
    const products = await db.sequelize.query(
      'SELECT * FROM products WHERE quantity > 0 ORDER BY quantity DESC',
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 5. Статистика по категориям
exports.getCategoryStatistics = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
         category, 
         COUNT(*) as product_count,
         ROUND(AVG(price), 2) as average_price,
         MIN(price) as min_price,
         MAX(price) as max_price
       FROM products 
       GROUP BY category 
       ORDER BY product_count DESC`,
      { type: QueryTypes.SELECT }
    );
    res.send(stats);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 6. Самые дорогие товары
exports.getTopExpensiveProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await db.sequelize.query(
      'SELECT * FROM products ORDER BY price DESC LIMIT :limit',
      {
        replacements: { limit },
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 7. Недавно добавленные товары (за последний месяц)
exports.getRecentProducts = async (_req, res) => {
  try {
    const products = await db.sequelize.query(
      "SELECT * FROM products WHERE created_at > CURRENT_DATE - INTERVAL '1 month' ORDER BY created_at DESC",
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true
      }
    );
    res.send(products);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};