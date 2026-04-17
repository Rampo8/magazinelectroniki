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
    }
  },
  actions: {
    async registerUser({ commit }, { email, password }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })
      
      let isRequestOk = true
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 3000))

      if (isRequestOk) {
        await promise.then(() => {
          commit('setUser', new User(1, email, password))
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка регистрации', { root: true })
          throw 'Упс... Ошибка регистрации'
        })
      }
    },

    // 🔹 14.1. Action loginUser (копия registerUser с изменённой логикой)
    async loginUser({ commit }, { email, password }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })
      
      // Имитация проверки логина/пароля
      let isRequestOk = false // Поставьте true, чтобы проверить успешный вход
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 3000))

      if (isRequestOk) {
        await promise.then(() => {
          commit('setUser', new User(1, email, password))
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка логина или пароля', { root: true })
          throw 'Упс... Ошибка логина или пароля'
        })
      }
    }
  },
  getters: {
    user(state) { return state.user }
  }
}