import { createStore } from 'vuex'
import ads from './ads'
import user from './user'
import shared from './shared'  // 🔹 Импорт нового модуля

const store = createStore({
  modules: {
    ads,
    user,
    shared  // 🔹 Подключение модуля
  }
})

export default store