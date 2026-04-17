// Класс User для типизации данных пользователя
class User {
  constructor(id, email, password) {
    this.id = id
    this.email = email
    this.password = password
  }
}

export default {
  state: {
    user: null
  },
  
  mutations: {
    // Установка пользователя после регистрации
    setUser(state, payload) {
      state.user = payload
    }
  },
  
  actions: {
    // Регистрация пользователя
    registerUser({ commit }, { email, password }) {
      // Здесь будет запрос на сервер для регистрации
      // Временно создаём пользователя с тестовым ID
      commit('setUser', new User(1, email, password))
    }
  },
  
  getters: {
    // Получение текущего пользователя
    user(state) {
      return state.user
    }
  }
}