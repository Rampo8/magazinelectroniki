export default {
  namespaced: true,
  state: {
    orders: []
  },
  mutations: {
    createOrder(state, payload) {
      state.orders.push(payload)
    }
  },
  actions: {
    // 🔹 18.5. Тестовый action создания заказа с задержкой 3 сек
    async createOrder({ commit }, { name, phone, adId, userId }) {
      console.log('Order data:', name, phone, adId, userId)
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      let isRequestOk = true
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 3000))

      if (isRequestOk) {
        await promise.then(() => {
          // Формируем объект заказа (в п.19 добавим класс Order)
          const newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            name, phone, adId, userId, done: false
          }
          commit('createOrder', newOrder)
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка создания заказа', { root: true })
          throw 'Упс... Ошибка создания заказа'
        })
      }
    }
  },
  getters: {
    orders: (state) => state.orders
  }
}