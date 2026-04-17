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
      </v-list>
    </v-navigation-drawer>
    
    <!-- Верхняя панель -->
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title>
        <v-btn text to="/">Home</v-btn>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.url"
          text
        >
          <v-icon start :icon="link.icon"></v-icon>
          {{ link.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    
    <!-- Основной контент -->
    <v-main>
      <router-view></router-view>
    </v-main>
    
    <!-- 🔹 Snackbar для отображения ошибок из shared module -->
    <v-snackbar
      v-model="showError"
      multi-line
      :timeout="3000"
      color="error"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="closeError"
        >
          Close
        </v-btn>
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
      links: [
        { title: "Login", icon: "mdi-lock", url: "/login" },
        { title: "Registration", icon: "mdi-face", url: "/registration" },
        { title: "Orders", icon: "mdi-bookmark-multiple-outline", url: "/orders" },
        { title: "New ad", icon: "mdi-note-plus-outline", url: "/new" },
        { title: "My ads", icon: "mdi-view-list-outline", url: "/list" }
      ]
    }
  },
  
  computed: {
    // 🔹 Получение ошибки из shared module
    errorMessage() {
      return this.$store.getters['shared/error']
    }
  },
  
  watch: {
    // 🔹 Авто-показ snackbar при появлении ошибки
    errorMessage(newVal) {
      if (newVal) {
        this.showError = true
      }
    }
  },
  
  methods: {
    // 🔹 Очистка ошибки
    closeError() {
      this.$store.dispatch('shared/clearError')
    }
  }
}
</script>