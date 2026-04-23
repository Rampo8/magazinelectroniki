<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">КИПУ</v-list-item-title>
          <v-list-item-subtitle>Учебный проект</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>
      
      <v-list dense>
        <v-list-item v-for="link in links" :key="link.title" :to="link.url">
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isUserLoggedIn" @click="onLogout">
          <template v-slot:prepend>
            <v-icon icon="mdi-exit-to-app"></v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title><v-btn text to="/">Добовление товара</v-btn></v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="link in links" :key="link.title" :to="link.url" text>
          <v-icon start :icon="link.icon"></v-icon>{{ link.title }}
        </v-btn>

        <v-btn v-if="isUserLoggedIn" text @click="onLogout">
          <v-icon start icon="mdi-exit-to-app"></v-icon>Выйти
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-snackbar v-model="showError" multi-line :timeout="3000" color="error" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="closeError">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      showError: false
      // 🔥 УДАЛЕНО: links отсюда, чтобы не дублировать ключ в computed
    }
  },
  
  computed: {
    errorMessage() {
      return this.$store.getters['shared/error']
    },
    isUserLoggedIn() {
      return this.$store.getters['user/isUserLoggedIn']
    },
    // 🔥 ОСТАВЛЕНО ТОЛЬКО ЗДЕСЬ:
    links() {
      if (this.isUserLoggedIn) {
        return [
          { title: "Управление Товарами  ", url: "/ad" },
          { title: "Корзина", url: "/cart" },
          { title: "Каталог",  url: "/orders" }
        ]
      } else {
        return [  
          { title: "Войти", icon: "mdi-lock", url: "/login" },
          { title: "Зарегестрироваться", icon: "mdi-face", url: "/register" }
        ]
      }
    }
  },
  
  watch: {
    errorMessage(newVal) {
      if (newVal) this.showError = true
    }
  },
  
  methods: {
    closeError() {
      this.$store.dispatch('shared/clearError')
      this.showError = false
    },
    onLogout() {
      this.$store.dispatch('user/logoutUser')
      this.$router.push('/')
    }
  }
}
</script>