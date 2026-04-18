// 🔹 19.1. Вспомогательный класс для типизации заказа
class Order {
  constructor(name, phone, adId, userId, done = false, id = null) {
    this.name = name
    this.phone = phone
    this.adId = adId
    this.userId = userId
    this.done = done
    this.id = id || Date.now().toString()
  }
}

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
    async createOrder({ commit, rootGetters }, { name, phone, adId, userId }) {
      console.log('Order payload:', name, phone, adId, userId)
      
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      let isRequestOk = true
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 3000))

      if (isRequestOk) {
        await promise.then(() => {
          // 🔹 19.1. Создание экземпляра класса Order
          const currentUserId = rootGetters['user/user']?.id || 'guest'
          const payload = new Order(name, phone, adId, currentUserId, false, Math.random().toString())
          
          commit('createOrder', payload)
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
    // 🔹 19.2. Получение заказов только текущего пользователя
    orders(state, getters, rootState, rootGetters) {
      const currentUser = rootGetters['user/user']
      if (!currentUser) return []
      return state.orders.filter(order => order.userId == currentUser.id)
    }
  }
}