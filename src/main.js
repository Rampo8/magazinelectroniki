import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import BuyAdModal from './views/Shared/BuyAdModal.vue' // 🔹 Импорт

loadFonts()

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

// 🔹 Глобальная регистрация для использования в любом компоненте без импорта
app.component('buy-ad-modal', BuyAdModal)

app.mount('#app')