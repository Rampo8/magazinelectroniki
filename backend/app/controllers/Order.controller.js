// ==================== 🛒 КОРЗИНА (Order со статусом 'cart') ====================

// Получить корзину пользователя
exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).send({ message: "user_id обязателен" });

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
    res.send(order);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

// Добавить товар в корзину
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;
    if (!user_id || !product_id) return res.status(400).send({ message: "user_id и product_id обязательны" });

    let order = await Order.findOne({ where: { user_id, status: 'cart' } });
    if (!order) order = await Order.create({ user_id, status: 'cart' });

    const product = await Product.findByPk(product_id);
    if (!product || product.stock_quantity < quantity) {
      return res.status(400).send({ message: "Товар недоступен или недостаточно на складе" });
    }

    let item = await OrderItem.findOne({ where: { order_id: order.id, product_id } });
    if (item) {
      await item.update({ quantity: item.quantity + quantity, price_at_purchase: product.price });
    } else {
      item = await OrderItem.create({
        order_id: order.id,
        product_id,
        quantity,
        price_at_purchase: product.price
      });
    }

    const updatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    res.send(updatedOrder);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

// Обновить количество в корзине
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params; // OrderItem.id
    const { quantity } = req.body;

    const item = await OrderItem.findByPk(id, { include: [{ model: Order, as: 'order' }] });
    if (!item || item.order.status !== 'cart') return res.status(404).send({ message: "Не найдено" });

    if (quantity <= 0) {
      await item.destroy();
    } else {
      await item.update({ quantity });
    }

    const updatedOrder = await Order.findByPk(item.order_id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    res.send(updatedOrder);
  } catch (e) { res.status(500).send({ message: e.message }); }
};

// Удалить товар из корзины
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id, { include: [{ model: Order, as: 'order' }] });
    if (!item || item.order.status !== 'cart') return res.status(404).send({ message: "Не найдено" });

    await item.destroy();
    res.send({ message: "Удалено" });
  } catch (e) { res.status(500).send({ message: e.message }); }
};

// Оформить заказ (перевести корзину в статус 'new')
exports.checkout = async (req, res) => {
  try {
    const { user_id } = req.body;
    const order = await Order.findOne({ 
      where: { user_id, status: 'cart' }, 
      include: [{ model: OrderItem, as: 'items' }] 
    });
    if (!order || order.items.length === 0) return res.status(400).send({ message: "Корзина пуста" });

    // Проверка остатков
    for (const item of order.items) {
      const product = await Product.findByPk(item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        return res.status(400).send({ message: `Недостаточно товара: ${product?.name || 'ID ' + item.product_id}` });
      }
    }

    // Списание остатков
    for (const item of order.items) {
      await Product.decrement('stock_quantity', { where: { id: item.product_id }, by: item.quantity });
    }

    // Смена статуса на оформленный заказ
    await order.update({ status: 'new', order_date: new Date() });

    const finalOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'user' },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ]
    });
    res.send(finalOrder);
  } catch (e) { res.status(500).send({ message: e.message }); }
};