// backend/app/controllers/Product.controller.js

const db = require("../models");
const Product = db.Product;
const User = db.User;
const Category = db.Category;
const { Op } = require("sequelize");

// ==================== 🔹 CRUD ОПЕРАЦИИ ====================

// ➕ Создать товар (POST /api/products)
exports.create = async (req, res) => {
  try {
    const data = await Product.create(req.body);
    res.status(201).send(data);
  } catch (e) {
    console.error("Create product error:", e);
    res.status(500).send({ message: e.message });
  }
};

// 📥 Получить все товары (GET /api/products)
exports.findAll = async (req, res) => {
  try {
    const { search, category_id, brand, min_price, max_price } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { characteristics: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (category_id) where.category_id = category_id;
    if (brand) where.brand = brand;
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    const data = await Product.findAll({
      where,
      include: [{ model: Category, as: "category" }],
      order: [["created_at", "DESC"]]
    });
    res.send(data);
  } catch (e) {
    console.error("FindAll products error:", e);
    res.status(500).send({ message: e.message });
  }
};

// 🔍 Получить один товар по ID (GET /api/products/:id)
exports.findOne = async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }]
    });
    if (!item) return res.status(404).send({ message: "Товар не найден" });
    res.send(item);
  } catch (e) {
    console.error("FindOne product error:", e);
    res.status(500).send({ message: e.message });
  }
};

// ✏️ Обновить товар (PUT /api/products/:id)
exports.update = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (!updated) return res.status(404).send({ message: "Товар не найден" });
    const updatedProduct = await Product.findByPk(req.params.id);
    res.send({ message: "Обновлено", product: updatedProduct });
  } catch (e) {
    console.error("Update product error:", e);
    res.status(500).send({ message: e.message });
  }
};

// 🗑️ Удалить товар (DELETE /api/products/:id)
exports.delete = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send({ message: "Товар не найден" });
    res.send({ message: "Товар удалён" });
  } catch (e) {
    console.error("Delete product error:", e);
    res.status(500).send({ message: e.message });
  }
};

// ==================== 💰 ПОКУПКА (Buy) ====================

// 💳 Купить товар (POST /api/products/:id/buy)
exports.buy = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1, user_id } = req.body;

    // 1. Валидация данных
    if (!user_id) {
      return res.status(400).json({ message: "user_id обязателен" });
    }

    // 2. Находим товар
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Преобразуем значения в числа для безопасных вычислений
    const price = Number(product.price) || 0;
    const availableStock = Number(product.stock_quantity) || 0;
    const buyQuantity = Number(quantity) || 1;
    
    const totalCost = price * buyQuantity;

    // 3. Проверяем наличие на складе
    if (availableStock < buyQuantity) {
      return res.status(400).json({ 
        message: `Недостаточно товара. Доступно: ${availableStock} шт.` 
      });
    }

    // 4. Находим пользователя
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // 🔥 ИСПРАВЛЕНИЕ: Безопасная проверка баланса (Number() || 0)
    const userBalance = Number(user.balance) || 0;

    if (userBalance < totalCost) {
      return res.status(400).json({ 
        message: `Недостаточно средств. Нужно: ${totalCost.toFixed(2)} ₽, ваш баланс: ${userBalance.toFixed(2)} ₽` 
      });
    }

    // 5. Атомарное списание (Транзакция)
    // Если один запрос упадёт, всё отменится (деньги не спишутся, товар не уйдёт)
    await db.sequelize.transaction(async (t) => {
      // Списываем товар со склада
      await Product.decrement("stock_quantity", { 
        by: buyQuantity, 
        where: { id }, 
        transaction: t 
      });
      
      // Списываем деньги с баланса пользователя
      await User.decrement("balance", { 
        by: totalCost, 
        where: { id: user_id }, 
        transaction: t 
      });
    });

    // 6. Получаем обновлённые данные для ответа
    const updatedProduct = await Product.findByPk(id);
    const updatedUser = await User.findByPk(user_id);
    
    // Снова используем Number() для безопасности ответа
    const newBalance = Number(updatedUser.balance) || 0;

    res.status(200).json({
      message: "✅ Покупка успешна",
      product: updatedProduct,
      new_balance: newBalance
    });

  } catch (error) {
    console.error("❌ Buy error:", error);
    res.status(500).json({ message: error.message });
  }
};