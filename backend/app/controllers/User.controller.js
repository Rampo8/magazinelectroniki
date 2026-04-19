const db = require("../models");
const { QueryTypes } = require('sequelize');
const User = db.user;

exports.create = async (req, res) => {
    try {
        const data = await User.create(req.body);
        res.status(201).send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await User.findAll();
        res.send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findOne = async (req, res) => {
    try {
        const item = await User.findByPk(req.params.id);
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

// ==================== НЕСТАНДАРТНЫЕ ЗАПРОСЫ (7 методов с raw SQL) ====================

// 1. Получить пользователей по городу (с поиском по части названия)
exports.getUsersByCity = async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).send({ message: "City is required" });

    const users = await db.sequelize.query(
      'SELECT * FROM users WHERE city ILIKE :cityPattern',
      {
        replacements: { cityPattern: `%${city}%` },
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 2. Статистика по балансу пользователей
exports.getBalanceStatistics = async (_req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
         COUNT(*) as total_users,
         SUM(balance) as total_balance,
         AVG(balance) as average_balance,
         MAX(balance) as max_balance,
         MIN(balance) as min_balance
       FROM users`,
      { type: QueryTypes.SELECT }
    );
    res.send(stats[0]);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 3. Топ пользователей по балансу
exports.getTopBalanceUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const users = await db.sequelize.query(
      'SELECT * FROM users ORDER BY balance DESC LIMIT :limit',
      {
        replacements: { limit },
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 4. Поиск пользователей по части номера телефона
exports.searchByPhonePart = async (req, res) => {
  try {
    const phone = req.query.phone;
    if (!phone) return res.status(400).send({ message: "Phone part is required" });

    const users = await db.sequelize.query(
      'SELECT * FROM users WHERE phone ILIKE :phonePattern',
      {
        replacements: { phonePattern: `%${phone}%` },
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 5. Пользователи с непустой корзиной
exports.getUsersWithCart = async (_req, res) => {
  try {
    const users = await db.sequelize.query(
      "SELECT * FROM users WHERE cart IS NOT NULL AND cart != '[]' AND cart != '{}' ",
      {
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 6. Пользователи с пустой корзиной
exports.getUsersWithoutCart = async (_req, res) => {
  try {
    const users = await db.sequelize.query(
      "SELECT * FROM users WHERE cart IS NULL OR cart = '[]' OR cart = '{}' ",
      {
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};

// 7. Недавно зарегистрированные пользователи (за последний месяц)
exports.getRecentUsers = async (_req, res) => {
  try {
    const users = await db.sequelize.query(
      "SELECT * FROM users WHERE created_at > CURRENT_DATE - INTERVAL '1 month'",
      {
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true
      }
    );
    res.send(users);
  } catch (e) { 
    res.status(500).send({ message: e.message }); 
  }
};