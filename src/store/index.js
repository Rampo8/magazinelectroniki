import { createStore } from 'vuex'
import user from './user'
import shared from './shared'
import orders from './orders'
import products from './products'
import cart from './orders'  // 👈 импортируем

export default createStore({
  modules: {
    user,
    shared,
    orders,
    products,
    cart  // 👈 регистрируем
  }
})