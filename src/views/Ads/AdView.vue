<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mt-5" v-if="ad">
          <v-img height="400px" :src="ad.src" cover></v-img>
          
          <v-card-text>
            <h1 class="text-primary mb-3">{{ ad.title }}</h1>
            <p>{{ ad.desc }}</p>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <!-- 🔹 17.6. Кнопка Edit доступна ТОЛЬКО владельцу объявления -->
            <EditAdModal :ad="ad" v-if="isOwner" />
            
            <v-btn class="success" color="success">Buy</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// 🔹 17.2. Локальная регистрация компонента
import EditAdModal from './EditAdModal.vue'

export default {
  props: ['id'],
  
  components: {
    EditAdModal
  },
  
  computed: {
    ad() {
      return this.$store.getters['ads/adById'](this.id)
    },
    // 🔹 17.6. Проверка: текущий пользователь = автор объявления?
    isOwner() {
      const currentUserId = this.$store.getters['user/user']?.id
      return this.ad?.userId === currentUserId
    }
  }
}
</script>