import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'

loadFonts()

const app = createApp(App)

// 🔹 15.1. Восстановление сессии перед монтированием приложения
store.dispatch('user/autoLogin')

app
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')