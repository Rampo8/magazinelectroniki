// backend/app/controllers/User.controller.js
const db = require("../models");
const { QueryTypes } = require('sequelize');
const User = db.User;  // ✅ Capital U

exports.create = async (req, res) => {
  try {
    const data = await User.create(req.body);
    const { password: _, ...userWithoutPassword } = data.toJSON();
    res.status(201).send(userWithoutPassword);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.findAll = async (_req, res) => {
  try {
    const data = await User.findAll({ attributes: { exclude: ['password'] } });
    res.send(data);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.findOne = async (req, res) => {
  try {
    const item = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    item ? res.send(item) : res.status(404).send({ message: "Not found" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const result = await User.update(req.body, { where: { id: req.params.id } });
    result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

exports.deleteAll = async (_req, res) => {
  try {
    const count = await User.destroy({ where: {}, truncate: false });
    res.send({ message: `${count} records deleted` });
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 🔐 ЛОГИН (простая проверка, без хеширования - только для разработки!)
exports.login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    
    const where = phone ? { phone } : { email };
    const user = await User.findOne({ where });
    
    if (!user) {
      return res.status(401).send({ message: "Пользователь не найден" });
    }
    
    // ⚠️ Прямое сравнение паролей (ТОЛЬКО ДЛЯ РАЗРАБОТКИ!)
    if (user.password !== password) {
      return res.status(401).send({ message: "Неверный пароль" });
    }
    
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.send(userWithoutPassword);
    
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// ==================== НЕСТАНДАРТНЫЕ ЗАПРОСЫ ====================
// (Оставляем как есть, они не меняются)
exports.getUsersByCity = async (req, res) => { /* ... */ };
exports.getBalanceStatistics = async (_req, res) => { /* ... */ };
// ... остальные методы без изменений