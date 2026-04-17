<template>
  <v-app>
    <!-- Боковое меню -->
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">КИПУ</v-list-item-title>
          <v-list-item-subtitle>Учебный проект</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>
      
      <v-list dense>
        <!-- 🔹 15.2. Динамические пункты меню -->
        <v-list-item
          v-for="link in links"
          :key="link.title"
          :to="link.url"
        >
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>

        <!-- 🔹 15.3. Кнопка Logout в дравере -->
        <v-list-item
          v-if="isUserLoggedIn"
          @click="onLogout"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-exit-to-app"></v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Верхняя панель -->
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title><v-btn text to="/">Home</v-btn></v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- 🔹 15.2. Динамические кнопки в хедере -->
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.url"
          text
        >
          <v-icon start :icon="link.icon"></v-icon>
          {{ link.title }}
        </v-btn>

        <!-- 🔹 15.3. Кнопка Logout в хедере -->
        <v-btn
          v-if="isUserLoggedIn"
          text
          @click="onLogout"
        >
          <v-icon start icon="mdi-exit-to-app"></v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Snackbar из пункта 14 -->
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
      showError: false,
      links: [] // Удалено из data, перенесено в computed
    }
  },
  
  computed: {
    errorMessage() {
      return this.$store.getters['shared/error']
    },
    // 🔹 15.2. Получение статуса авторизации
    isUserLoggedIn() {
      return this.$store.getters['user/isUserLoggedIn']
    },
    // 🔹 15.2. Динамическое формирование меню
    links() {
      if (this.isUserLoggedIn) {
        return [
          { title: "Orders", icon: "mdi-bookmark-multiple-outline", url: "/orders" },
          { title: "New ad", icon: "mdi-note-plus-outline", url: "/new" },
          { title: "My ads", icon: "mdi-view-list-outline", url: "/list" }
        ]
      } else {
        return [
          { title: "Login", icon: "mdi-lock", url: "/login" },
          { title: "Registration", icon: "mdi-face", url: "/registration" }
        ]
      }
    }
  },
  
  watch: {
    errorMessage(newVal) { if (newVal) this.showError = true }
  },
  
  methods: {
    closeError() {
      this.$store.dispatch('shared/clearError')
      this.showError = false
    },
    // 🔹 15.3. Обработка выхода
    onLogout() {
      this.$store.dispatch('user/logoutUser')
      this.$router.push('/')
    }
  }
}
</script>