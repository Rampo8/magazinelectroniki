const db = require("../models");
const { QueryTypes } = require('sequelize');
const Category = db.category;

exports.create = async (req, res) => {
    try {
        const data = await Category.create(req.body);
        res.status(201).send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Category.findAll();
        res.send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Category.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.update = async (req, res) => {
    try {
        const result = await Category.update(req.body, { where: { id: req.params.id } });
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Category.destroy({ where: { id: req.params.id } });
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Category.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

// ==================== НЕСТАНДАРТНЫЕ МЕТОДЫ ====================

// Поиск категории по названию
exports.searchByName = async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).send({ message: "Name parameter is required" });

    const categories = await db.sequelize.query(
      'SELECT * FROM categories WHERE name ILIKE :namePattern',
      {
        replacements: { namePattern: `%${name}%` },
        type: QueryTypes.SELECT,
        model: Category,
        mapToModel: true
      }
    );
    res.send(categories);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// Популярные категории (с наибольшим количеством товаров)
exports.getPopularCategories = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
         c.id, 
         c.name, 
         COUNT(p.id) as product_count 
       FROM categories c 
       LEFT JOIN products p ON p.category_id = c.id 
       GROUP BY c.id, c.name 
       ORDER BY product_count DESC`,
      { 
        type: QueryTypes.SELECT 
      }
    );
    res.send(stats);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// Категории с количеством товаров
exports.getCategoriesWithProductsCount = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
         c.id, 
         c.name, 
         c.description,
         COUNT(p.id) as product_count 
       FROM categories c 
       LEFT JOIN products p ON p.category_id = c.id 
       GROUP BY c.id, c.name, c.description 
       ORDER BY product_count DESC`,
      { type: QueryTypes.SELECT }
    );
    res.send(stats);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};