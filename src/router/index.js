import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdListView from '../views/Ads/AdListView.vue'
import AdView from '../views/Ads/AdView.vue'
import NewAdView from '../views/Ads/NewAdView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import RegistrationView from '../views/Auth/RegistrationView.vue'
import OrdersView from '../views/User/OrdersView.vue'
import AuthGuard from './auth-guard' // 🔹 15.4. Импорт гарда

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/ad/:id', name: 'ad', component: AdView, props: true },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/registration', name: 'reg', component: RegistrationView },
  
  // 🔹 15.4. Защищённые маршруты (доступны только авторизованным)
  { path: '/list', name: 'list', component: AdListView, beforeEnter: AuthGuard },
  { path: '/new', name: 'newAd', component: NewAdView, beforeEnter: AuthGuard },
  { path: '/orders', name: 'orders', component: OrdersView, beforeEnter: AuthGuard }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router