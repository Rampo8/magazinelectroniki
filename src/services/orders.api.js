// src/services/orders.api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:6868/api',
  headers: { 'Content-Type': 'application/json' }
})

export const ordersApi = {
  // 🛒 Корзина
  getCart: (userId) => api.get('/orders/cart', { params: { user_id: userId } }).then(r => r.data),
  addToCart: (payload) => api.post('/orders/cart', payload).then(r => r.data),
  updateCartItem: (itemId, data) => api.put(`/orders/cart/${itemId}`, data).then(r => r.data),
  removeFromCart: (itemId) => api.delete(`/orders/cart/${itemId}`).then(r => r.data),
  checkout: (payload) => api.post('/orders/checkout', payload).then(r => r.data),

  // 📦 Заказы
  getAll: (params) => api.get('/orders', { params }).then(r => r.data),
  getById: (id) => api.get(`/orders/${id}`).then(r => r.data),
  create: (payload) => api.post('/orders', payload).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then(r => r.data)
}

export default ordersApi