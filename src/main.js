import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import BuyAdModal from './views/Shared/BuyAdModal.vue' // 🔹 Импорт
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:6868', // ← сюда будет API
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
loadFonts()

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

// 🔹 Глобальная регистрация для использования в любом компоненте без импорта
app.component('buy-ad-modal', BuyAdModal)

app.mount('#app')
export default apiClient;