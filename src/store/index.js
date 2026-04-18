import { createStore } from 'vuex'
import ads from './ads'
import user from './user'
import shared from './shared'
import orders from './orders' // 🔹 Импорт нового модуля

export default createStore({
  modules: {
    ads,
    user,
    shared,
    orders // 🔹 Регистрация модуля
  }
})