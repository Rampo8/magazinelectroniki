// src/store/user.js
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:6868/api'

export default {
  namespaced: true,

  state: {
    user: null
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
      if (payload) {
        localStorage.setItem('user', JSON.stringify({
          id: payload.id,
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          city: payload.city,
          balance: payload.balance
        }))
      } else {
        localStorage.removeItem('user')
      }
    },
    setUserBalance(state, newBalance) {
  if (state.user) {
    state.user.balance = newBalance
    // Обновляем localStorage, чтобы баланс сохранялся при перезагрузке
    localStorage.setItem('user', JSON.stringify(state.user))
  }
}
  },

  actions: {
    // 🔹 Регистрация (просто отправляем данные)
    async registerUser({ commit }, payload) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Ошибка регистрации')

        commit('setUser', data)
        return data
      } catch (err) {
        commit('shared/setError', err.message, { root: true })
        throw err
      } finally {
        commit('shared/setLoading', false, { root: true })
      }
    },

    // 🔹 Логин (простая проверка)
    async loginUser({ commit }, payload) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)  // { phone/email, password }
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Ошибка входа')

        commit('setUser', data)
        return data
      } catch (err) {
        commit('shared/setError', err.message, { root: true })
        throw err
      } finally {
        commit('shared/setLoading', false, { root: true })
      }
    },

    logoutUser({ commit }) {
      commit('setUser', null)
    },

    autoLogin({ commit }) {
      const saved = localStorage.getItem('user')
      if (saved) {
        try {
          commit('setUser', JSON.parse(saved))
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    }
  },

  getters: {
    user: state => state.user,
    isUserLoggedIn: state => state.user !== null,
    userId: state => state.user?.id,
    userName: state => state.user?.full_name
  }
}