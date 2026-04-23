// src/store/modules/orders.js
import { ordersApi } from '../services/orders.api'

export default {
  namespaced: true,

  state: {
    cart: null,
    orders: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_CART(state, cart) { state.cart = cart },
    SET_ORDERS(state, orders) { state.orders = orders },
    SET_LOADING(state, status) { state.loading = status },
    SET_ERROR(state, error) { state.error = error },
    CLEAR_ERROR(state) { state.error = null }
  },

  actions: {
    // 🔹 Получить корзину
    async fetchCart({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const userId = rootGetters['user/user']?.id
        if (!userId) throw new Error('Пользователь не авторизован')
        
        const cart = await ordersApi.getCart(userId)
        commit('SET_CART', cart)
        return cart
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Добавить в корзину
    async addToCart({ commit, rootGetters }, { product_id, quantity = 1 }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const userId = rootGetters['user/user']?.id
        if (!userId) throw new Error('Пользователь не авторизован')
        
        const updatedCart = await ordersApi.addToCart({
          product_id,
          quantity,
          user_id: userId
        })
        commit('SET_CART', updatedCart)
        return updatedCart
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Обновить количество
    async updateCartItem({ commit }, { itemId, quantity }) {
      commit('SET_LOADING', true)
      try {
        const updatedCart = await ordersApi.updateCartItem(itemId, { quantity })
        commit('SET_CART', updatedCart)
        return updatedCart
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Удалить из корзины
    async removeFromCart({ commit }, itemId) {
      commit('SET_LOADING', true)
      try {
        const updatedCart = await ordersApi.removeFromCart(itemId)
        commit('SET_CART', updatedCart)
        return updatedCart
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Оформить заказ
    async checkout({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const userId = rootGetters['user/user']?.id
        if (!userId) throw new Error('Пользователь не авторизован')
        
        const order = await ordersApi.checkout({ user_id: userId })
        commit('SET_CART', null)
        return order
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Получить список заказов (✅ С СОРТИРОВКОЙ: корзина первая)
    async fetchOrders({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const userId = rootGetters['user/user']?.id
        console.log('📡 [Store] Fetch orders for user:', userId)

        if (!userId) {
          commit('SET_ORDERS', [])
          return []
        }

        const response = await ordersApi.getAll({ user_id: userId })
        
        // 🛡️ Безопасное извлечение массива
        let ordersList = []
        if (Array.isArray(response)) {
          ordersList = response
        } else if (response?.data && Array.isArray(response.data)) {
          ordersList = response.data
        } else if (response?.orders && Array.isArray(response.orders)) {
          ordersList = response.orders
        }

        // 🎯 Сортировка: корзина (статус 'cart') всегда ПЕРВАЯ
        ordersList.sort((a, b) => {
          if (a.status === 'cart' && b.status !== 'cart') return -1
          if (a.status !== 'cart' && b.status === 'cart') return 1
          return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
        })

        console.log('✅ [Store] Orders sorted:', ordersList.map(o => ({ id: o.id, status: o.status })))
        commit('SET_ORDERS', ordersList)
        return ordersList
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Ошибка загрузки заказов'
        commit('SET_ERROR', msg)
        console.error('❌ [Store] fetchOrders error:', err)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Обновить статус заказа
    async updateOrderStatus({ commit }, { orderId, status }) {
      try {
        const updatedOrder = await ordersApi.updateStatus(orderId, status)
        return updatedOrder
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      }
    }
  },

  getters: {
    cart: state => state.cart,
    cartItems: state => state.cart?.items || [],
    cartTotal: state => 
      state.cart?.items?.reduce((sum, i) => 
        sum + (i.price_at_purchase || i.price || 0) * i.quantity, 0) || 0,
    orders: state => state.orders,
    isLoading: state => state.loading,
    error: state => state.error
  }
}