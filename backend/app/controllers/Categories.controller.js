const db = require("../models");
const Category = db.Category;

exports.create = async (req, res) => {
  try { res.status(201).json(await Category.create(req.body)); } 
  catch (e) { res.status(500).json({ message: e.message }); }
};

exports.findAll = async (_req, res) => {
  try { res.json(await Category.findAll()); } 
  catch (e) { res.status(500).json({ message: e.message }); }
};

exports.findOne = async (req, res) => {
  try { 
    const item = await Category.findByPk(req.params.id); 
    item ? res.json(item) : res.status(404).json({ message: "Not found" }); 
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  try { 
    const result = await Category.update(req.body, { where: { id: req.params.id } }); 
    result[0] ? res.json({ message: "Updated" }) : res.status(404).json({ message: "Not found" }); 
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ✅ Заменяем delete -> deleteOne (избегаем зарезервированного слова)
exports.deleteOne = async (req, res) => {
  try { 
    const result = await Category.destroy({ where: { id: req.params.id } }); 
    result ? res.json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" }); 
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ✅ Добавляем метод для удаления ВСЕХ категорий
exports.deleteAll = async (req, res) => {
  try { 
    const count = await Category.destroy({ where: {}, truncate: true }); 
    res.json({ message: "All categories deleted", deletedCount: count }); 
  } catch (e) { res.status(500).json({ message: e.message }); }
};