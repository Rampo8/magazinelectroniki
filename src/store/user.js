class User {
  constructor(id, email) {
    this.id = id
    this.email = email
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
      if (payload) {
        localStorage.setItem('user', JSON.stringify({ id: payload.id, email: payload.email }))
      } else {
        localStorage.removeItem('user')
      }
    }
  },

  actions: {
    // 🔥 Убран unused _password из деструктуризации
    async registerUser({ commit }, { email }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      await new Promise(resolve => setTimeout(resolve, 2000))

      const user = new User(Date.now().toString(), email)
      commit('setUser', user)
      commit('shared/setLoading', false, { root: true })
    },

    // 🔥 Убран unused _password из деструктуризации
    async loginUser({ commit }, { email }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      await new Promise(resolve => setTimeout(resolve, 1500))

      const user = new User("user123", email)
      commit('setUser', user)
      commit('shared/setLoading', false, { root: true })
    },

    logoutUser({ commit }) {
      commit('setUser', null)
    },

    autoLogin({ commit }) {
      const saved = localStorage.getItem('user')
      if (saved) {
        const parsed = JSON.parse(saved)
        commit('setUser', new User(parsed.id, parsed.email))
      }
    }
  },

  getters: {
    user: (state) => state.user,
    isUserLoggedIn: (state) => state.user !== null
  }
}