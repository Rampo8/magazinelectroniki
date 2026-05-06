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
    // 🔹 Регистрация
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

    // 🔹 Логин
    async loginUser({ commit }, payload) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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

    // 🔹 Выход
    logoutUser({ commit }) {
      commit('setUser', null)
    },

    // 🔹 Авто-вход при перезагрузке
    autoLogin({ commit }) {
      const saved = localStorage.getItem('user')
      if (saved) {
        try {
          commit('setUser', JSON.parse(saved))
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    },
    
    // 🔹 🔥 НОВОЕ: Загрузка баланса с сервера
    async fetchBalance({ commit, state }) {
      // Если пользователь не авторизован — выходим
      if (!state.user?.id) return;
      
      try {
        // 🔧 ВАЖНО: Проверьте, какой URL использует ваш бэкенд!
        // Вариант А: баланс текущего пользователя (без ID в URL)
        const response = await fetch(`${API_URL}/user/balance`, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        // Вариант Б: если нужен ID в URL, раскомментируйте строку ниже и закомментируйте Вариант А:
        // const response = await fetch(`${API_URL}/users/${state.user.id}/balance`, { headers: { 'Content-Type': 'application/json' } });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Не удалось загрузить баланс');
        }
        
        const data = await response.json();
        // 🔧 ВАЖНО: Проверьте имя поля в ответе (data.balance или data.amount)
        commit('setUserBalance', data.balance);
        return data.balance;
      } catch (e) {
        console.error('Fetch balance error:', e);
        // Не пробрасываем ошибку, чтобы не ломать интерфейс, если баланс не критичен
        return null;
      }
    }
  },

  getters: {
    user: state => state.user,
    isUserLoggedIn: state => state.user !== null,
    userId: state => state.user?.id,
    userName: state => state.user?.full_name,
    
    // 🔹 🔥 НОВОЕ: Геттер для баланса
    balance: state => {
      const val = state.user?.balance;
      return val !== undefined && val !== null ? parseFloat(val) : null;
    }
  }
}