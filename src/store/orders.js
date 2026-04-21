// src/store/orders.js
import { ordersApi } from '../services/orders.api'  // ✅ Относительный путь

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
    ADD_ORDER(state, order) { state.orders.push(order) },
    SET_LOADING(state, status) { state.loading = status },
    SET_ERROR(state, error) { state.error = error },
    CLEAR_ERROR(state) { state.error = null }
  },

  actions: {
    // 🔹 Получить корзину
    async fetchCart({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      try {
        const userId = rootGetters['user/user']?.id
        if (!userId) throw new Error('Не авторизован')
        const cart = await ordersApi.getCart(userId)  // ✅ userId используется
        commit('SET_CART', cart)
        return cart
      } catch (err) {
        commit('SET_ERROR', err.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Добавить в корзину
    async addToCart({ commit, rootGetters }, payload) {
      commit('SET_LOADING', true)
      try {
        const userId = rootGetters['user/user']?.id
        const updatedCart = await ordersApi.addToCart({ ...payload, user_id: userId })  // ✅ userId используется
        commit('SET_CART', updatedCart)
        return updatedCart
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Обновить количество (✅ убран неиспользуемый userId)
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

    // 🔹 Удалить из корзины (✅ убран неиспользуемый userId)
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
      try {
        const userId = rootGetters['user/user']?.id
        const order = await ordersApi.checkout({ user_id: userId })  // ✅ userId используется
        commit('SET_CART', null)
        commit('ADD_ORDER', order)
        return order
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 🔹 Получить список заказов
    async fetchOrders({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const orders = await ordersApi.getAll(params)
        commit('SET_ORDERS', orders)
        return orders
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    cart: state => state.cart,
    cartItems: state => state.cart?.items || [],
    cartTotal: state => state.cart?.items?.reduce((sum, i) => sum + i.price_at_purchase * i.quantity, 0) || 0,
    cartCount: state => state.cart?.items?.reduce((count, i) => count + i.quantity, 0) || 0,
    orders: state => state.orders,
    isLoading: state => state.loading,
    error: state => state.error
  }
}