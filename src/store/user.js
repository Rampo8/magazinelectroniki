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
    // 🔹 Рефакторинг с async/await и shared module
    async registerUser({ commit }, { email, password }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })
      
      // Имитация запроса на сервер
      let isRequestOk = true
      let promise = new Promise(function(resolve) {
        setTimeout(() => resolve('Done'), 3000)
      })
      
      if (isRequestOk) {
        await promise.then(() => {
          commit('setUser', new User(1, email, password))
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка регистрации')
          throw 'Упс... Ошибка регистрации'
        })
      }
    }
  },
  
  getters: {
    user(state) {
      return state.user
    }
  }
}