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
    updateAd(state, { id, title, desc }) {
      const ad = state.ads.find(a => a.id === id)
      if (ad) {
        ad.title = title
        ad.desc = desc
      }
    }
  },

  actions: {
    // ✅ Убран unused `dispatch`. `commit` и `rootGetters` теперь реально используются
    async createAd({ commit, rootGetters }, payload) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      payload.id = Math.random().toString(36).substr(2, 9)
      payload.userId = rootGetters['user/user']?.id || '1'

      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1500))

      commit('createAd', payload)
      commit('shared/setLoading', false, { root: true })
    },

    // ✅ `commit` используется
    async updateAd({ commit }, { id, title, desc }) {
      commit('shared/clearError', null, { root: true })
      commit('shared/setLoading', true, { root: true })

      await new Promise(resolve => setTimeout(resolve, 1500))

      commit('updateAd', { id, title, desc })
      commit('shared/setLoading', false, { root: true })
    }
  },

  getters: {
    allAds: (state) => state.ads,
    promoAds: (state) => state.ads.filter(ad => ad.promo),
    myAds: (state, _getters, _rootState, rootGetters) => {
      const currentUserId = rootGetters['user/user']?.id
      return currentUserId ? state.ads.filter(ad => ad.userId === currentUserId) : []
    },
    adById: (state) => (id) => state.ads.find(ad => ad.id === String(id))
  }
}