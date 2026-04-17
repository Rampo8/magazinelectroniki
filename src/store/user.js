class User {
  constructor(id, email, password) {
    this.id = id
    this.email = email
    this.password = password
  }
}

export default {
  namespaced: true,
  
  state: {
    user: null
  },
  
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // Опционально: сохраняем сессию в localStorage
      if (payload) {
        localStorage.setItem('user', JSON.stringify({
          id: payload.id,
          email: payload.email
        }))
      } else {
        localStorage.removeItem('user')
      }
    },
    // 🔹 15.3. Очистка пользователя при выходе
    clearUser(state) {
      state.user = null
    }
  },
  
  actions: {
    async registerUser({ commit }, { email, password }) { /* ... логика из п.14 ... */ },
    async loginUser({ commit }, { email, password }) { /* ... логика из п.14 ... */ },
    
    // 🔹 15.3. Действие выхода
    logoutUser({ commit }) {
      commit('clearUser')
    },

    // 🔹 15.1. Авто-логин при загрузке приложения (восстановление сессии)
    autoLogin({ commit }) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        commit('setUser', JSON.parse(savedUser))
      }
    }
  },
  
  getters: {
    user(state) { return state.user },
    // 🔹 15.1. Проверка авторизации
    isUserLoggedIn(state) {
      return state.user !== null
    }
  }
}