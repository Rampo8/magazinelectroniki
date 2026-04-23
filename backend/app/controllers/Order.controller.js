// backend/app/controllers/Order.controller.js
const { Order, OrderItem, Product, User } = require('../models');
const { Op } = require('sequelize');
exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id обязателен' });

    let order = await Order.findOne({
      where: { user_id, status: 'cart' },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });

    if (!order) {
      order = await Order.create({ user_id, status: 'cart' });
      order.items = [];
    }
    res.json(order);
  } catch (e) {
    console.error('❌ getCart Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ message: 'Нужны user_id и product_id' });

    let order = await Order.findOne({ where: { user_id, status: 'cart' } });
    if (!order) order = await Order.create({ user_id, status: 'cart' });

    const product = await Product.findByPk(product_id);
    if (!product || product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Товар недоступен' });
    }

    let item = await OrderItem.findOne({ where: { order_id: order.id, product_id } });
    if (item) {
      await item.update({ quantity: item.quantity + quantity, price_at_purchase: product.price });
    } else {
      await OrderItem.create({ order_id: order.id, product_id, quantity, price_at_purchase: product.price });
    }

    const updatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    res.json(updatedOrder);
  } catch (e) {
    console.error('❌ addToCart Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.checkout = async (req, res) => {
  try {
    const { user_id } = req.body;
    const order = await Order.findOne({
      where: { user_id, status: 'cart' },
      include: [{ model: OrderItem, as: 'items' }]
    });
    if (!order || !order.items.length) return res.status(400).json({ message: 'Корзина пуста' });
    for (const item of order.items) {
      const prod = await Product.findByPk(item.product_id);
      if (!prod || prod.stock_quantity < item.quantity) {
        return res.status(400).json({ message: `Нет товара: ${prod?.name}` });
      }
    }
    const transaction = await Order.sequelize.transaction();
    try {
      for (const item of order.items) {
        await Product.decrement('stock_quantity', { 
          where: { id: item.product_id }, 
          by: item.quantity, 
          transaction 
        });
      }
      await order.update({ status: 'new', order_date: new Date() }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    res.json({ message: 'Заказ оформлен', order });
  } catch (e) {
    console.error('❌ checkout Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await OrderItem.findByPk(id, { include: [{ model: Order, as: 'order' }] });
    
    if (!item || item.order.status !== 'cart') {
      return res.status(404).json({ message: 'Позиция не найдена' });
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      await item.update({ quantity });
    }

    const updatedOrder = await Order.findByPk(item.order_id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    res.json(updatedOrder);
  } catch (e) {
    console.error('❌ updateCartItem Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id, { include: [{ model: Order, as: 'order' }] });
    
    if (!item || item.order.status !== 'cart') {
      return res.status(404).json({ message: 'Позиция не найдена' });
    }

    await item.destroy();
    res.json({ message: 'Удалено' });
  } catch (e) {
    console.error('❌ removeFromCart Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log('📥 [getUserOrders] Запрос для пользователя:', user_id);

    if (!user_id) return res.status(400).json({ message: 'user_id обязателен' });

    const orders = await Order.findAll({
      where: { user_id }, 
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ [getUserOrders] Найдено записей: ${orders.length}`);
    res.json(orders);
  } catch (e) {
    console.error('❌ getUserOrders Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    res.json(order);
  } catch (e) {
    console.error('❌ getOrderById Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    
    await order.update({ status });
    res.json(order);
  } catch (e) {
    console.error('❌ updateOrderStatus Error:', e);
    res.status(500).json({ message: e.message });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    
    await order.destroy();
    res.json({ message: 'Заказ удалён' });
  } catch (e) {
    console.error('❌ deleteOrder Error:', e);
    res.status(500).json({ message: e.message });
  }
};