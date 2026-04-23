// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// import store from '@/store'  // если нужна проверка авторизации

// 🔹 Импортируй компоненты (ленивая загрузка)
const ProductsList = () => import('@/views/Ads/AdListView.vue')
const AdView = () => import('@/views/Ads/AdView.vue')
const LoginView = () => import('@/views/Auth/LoginView.vue')
const RegistrationView = () => import('@/views/Auth/RegistrationView.vue')
const Cart = () => import('@/views/Ads/NewAdView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/products'
  },
  {
    path: '/ad',
    name: 'AdView',
    component: AdView
  },
    {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
    {
    path: '/products',
    name: 'ProductsList',
    component: ProductsList
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Registration',
    component: RegistrationView
  },
   
  {
    path: '/orders',
    name: 'Cart',
    component: () => import('@/views/User/OrdersView.vue'),
    
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 🔹 Глобальная навигация (опционально, для защиты роутов)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user') // или проверка в store
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router