// src/services/products.api.js
import axios from 'axios'

const api = axios.create({
  // ✅ Точный URL твоего бэкенда (без слэша в конце)
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:6868/api',
  headers: { 'Content-Type': 'application/json' }
})

export const productsApi = {
  getAll: (params) => api.get('/products', { params }).then(r => r.data),
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),
  create: (payload) => api.post('/products', payload).then(r => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then(r => r.data),
  delete: (id) => api.delete(`/products/${id}`).then(r => r.data),
  
  // 🔹 Прямая покупка
  buy: (id, payload) => api.post(`/products/${id}/buy`, payload).then(r => r.data)
}
export default productsApi