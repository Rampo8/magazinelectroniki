export default {
  namespaced: true,

  state: () => ({
    // 🔹 16.1. Добавлено поле userId в тестовые данные
    ads: [
      {
        id: "1",
        title: "First",
        desc: "First Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
        userId: "1"
      },
      {
        id: "2",
        title: "Second",
        desc: "Second Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
        userId: "1"
      },
      {
        id: "3",
        title: "Third",
        desc: "Third Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
        userId: "2"
      },
      {
        id: "4",
        title: "Fourth",
        desc: "Fourth Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
        userId: "1"
      }
    ]
  }),

  mutations: {
    createAd(state, payload) {
      state.ads.push(payload)
    }
  },

  actions: {
    // 🔹 16.2. Асинхронный createAd с loading/error и userId
    async createAd({ commit, rootGetters, dispatch }, payload) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      // Генерация ID и привязка к текущему пользователю
      payload.id = Math.random().toString(36).substr(2, 9)
      payload.userId = rootGetters['user/user']?.id || '1'

      // Имитация запроса на сервер
      let isRequestOk = true
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 3000))

      if (isRequestOk) {
        await promise.then(() => {
          commit('createAd', payload)
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка создания объявления', { root: true })
          throw 'Упс... Ошибка создания объявления'
        })
      }
    }
  },

  getters: {
    allAds(state) { return state.ads },
    promoAds(state) { return state.ads.filter(ad => ad.promo) },
    
    // 🔹 16.4. Фильтрация объявлений только текущего пользователя
    myAds(state, getters, rootState, rootGetters) {
      const currentUserId = rootGetters['user/user']?.id
      if (!currentUserId) return []
      return state.ads.filter(ad => ad.userId === currentUserId)
    },

    adById(state) {
      return id => state.ads.find(ad => ad.id === String(id))
    }
  }
}