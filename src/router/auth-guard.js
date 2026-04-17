import store from '../store'

// 🔹 15.4. Функция-гард для защиты приватных страниц
export default function(to, from, next) {
  // Проверяем getter из namespaced модуля user
  if (store.getters['user/isUserLoggedIn']) {
    next() // Пользователь залогинен → пропускаем
  } else {
    // Не залогинен → редирект на логин с флагом ошибки
    next('/login?loginError=true')
  }
}