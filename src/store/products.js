// src/store/products.js
import { productsApi } from '@/services/products.api'

export default {
  namespaced: true,

  state: {
    products: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product)
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    // 📥 GET: получить все товары
    async fetchProducts({ commit }) {
      commit('shared/setLoading', true, { root: true })
      commit('CLEAR_ERROR')
      
      try {
        const data = await productsApi.getAll()
        commit('SET_PRODUCTS', data)
        return data
      } catch (err) {
        const msg = err.response?.data?.message || err.message
        commit('SET_ERROR', msg)
        commit('shared/setError', msg, { root: true })
        throw err
      } finally {
        commit('shared/setLoading', false, { root: true })
      }
    },

    // ➕ POST: создать товар
    async createProduct({ commit }, payload) {
      commit('shared/setLoading', true, { root: true })
      commit('CLEAR_ERROR')
      
      try {
        // 🔹 payload приходит с полями: name, price, characteristics, stock_quantity, brand, category_id
        
        const productData = {
          name: payload.name,
          characteristics: payload.characteristics || null,  // ✅ characteristics вместо description
          price: Number(payload.price),
          stock_quantity: Number(payload.stock_quantity) || 0,
          category_id: payload.category_id || null,
          brand: payload.brand || null,
          user_id: payload.user_id || null
        }

        const created = await productsApi.create(productData)
        commit('ADD_PRODUCT', created)
        return created
      } catch (err) {
        const msg = err.response?.data?.message || err.message
        commit('SET_ERROR', msg)
        commit('shared/setError', msg, { root: true })
        throw err
      } finally {
        commit('shared/setLoading', false, { root: true })
      }
    },

    // 🔹 Получить один товар по ID
    async fetchProductById({ commit, state }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      try {
        // 🔍 Сначала ищем в кэше
        const cached = state.products.find(p => String(p.id) === String(id))
        if (cached) return cached
        
        // 🔍 Если нет — загружаем с сервера
        const product = await productsApi.getById(id)
        return product
      } catch (err) {
        commit('SET_ERROR', err.message)
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
      
    },
    
    async buyProduct({ commit, state, rootState }, { productId, quantity = 1, user_id }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      const response = await productsApi.buy(productId, { quantity, user_id })
      
      // 1️⃣ Обновляем остаток товара в списке
      const idx = state.products.findIndex(p => p.id == productId)
      if (idx !== -1) {
        state.products[idx].stock_quantity = response.product.stock_quantity
      }

      // 2️⃣ Обновляем баланс пользователя в Vuex (если модуль user существует)
      if (rootState.user && response.new_balance !== undefined) {
        commit('user/setUserBalance', response.new_balance, { root: true })
        // Если мутации нет, можно просто обновить весь объект:
        // commit('user/setUser', { ...rootState.user.user, balance: response.new_balance }, { root: true })
      }

      return response
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.message || err.message)
      throw err
    } finally {
      commit('SET_LOADING', false)
    }
  }
},

  getters: {
    allProducts: state => state.products,
    isLoading: state => state.loading,
    error: state => state.error,
    productById: state => id => state.products.find(p => String(p.id) === String(id))
  }
}