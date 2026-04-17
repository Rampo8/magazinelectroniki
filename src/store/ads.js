export default {
  namespaced: true,

  state: () => ({
    ads: [
      { id: "1", title: "First", desc: "First Desc", promo: true, src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg", userId: "1" },
      { id: "2", title: "Second", desc: "Second Desc", promo: true, src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg", userId: "1" },
      { id: "3", title: "Third", desc: "Third Desc", promo: false, src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg", userId: "2" },
      { id: "4", title: "Fourth", desc: "Fourth Desc", promo: true, src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg", userId: "1" }
    ]
  }),

  mutations: {
    createAd(state, payload) {
      state.ads.push(payload)
    },
    
    // 🔹 17.5. Мутация обновления объявления
    updateAd(state, { id, title, desc }) {
      const ad = state.ads.find(a => a.id === id)
      if (ad) {
        ad.title = title
        ad.desc = desc
      }
    }
  },

  actions: {
    async createAd({ commit, rootGetters }) { /* ... код из п.16 ... */ },
    
    // 🔹 17.5. Action редактирования объявления
    async updateAd({ commit, dispatch }, { id, title, desc }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })
      
      let isRequestOk = true
      let promise = new Promise(resolve => setTimeout(() => resolve('Done'), 1500))

      if (isRequestOk) {
        await promise.then(() => {
          commit('updateAd', { id, title, desc })
          commit('shared/setLoading', false, { root: true })
        })
      } else {
        await promise.then(() => {
          commit('shared/setLoading', false, { root: true })
          commit('shared/setError', 'Ошибка редактирования объявления', { root: true })
          throw 'Упс... Ошибка редактирования'
        })
      }
    }
  },

  getters: {
    allAds(state) { return state.ads },
    promoAds(state) { return state.ads.filter(ad => ad.promo) },
    myAds(state, getters, rootState, rootGetters) {
      const currentUserId = rootGetters['user/user']?.id
      return currentUserId ? state.ads.filter(ad => ad.userId === currentUserId) : []
    },
    adById(state) {
      return id => state.ads.find(ad => ad.id === String(id))
    }
  }
}