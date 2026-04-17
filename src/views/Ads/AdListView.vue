<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <h1 class="text-secondary mb-3 mt-3">My ads</h1>
        
        <!-- 🔹 16.4. Перебор объявлений из computed свойства -->
        <v-card 
          v-for="ad in myAds" 
          :key="ad.id" 
          class="mb-3 elevation-4"
        >
          <v-row no-gutters>
            <v-col cols="4">
              <v-img :src="ad.src" height="175px" cover class="rounded-l"></v-img>
            </v-col>
            <v-col cols="8">
              <h2 class="text-primary text-h6 pa-2 pb-0">{{ ad.title }}</h2>
              <p class="text-body-2 pa-2 pt-0" style="height: 85px; overflow: hidden; text-overflow: ellipsis;">
                {{ ad.desc }}
              </p>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" :to="'/ad/' + ad.id">Open</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
        
        <v-alert v-if="myAds.length === 0" type="info" variant="tonal" class="mt-4">
          You don't have any ads yet.
        </v-alert>
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // 🔹 16.4. Удалён блок data с локальным массивом ads
  computed: {
    myAds() {
      // Получаем отфильтрованный список из store
      return this.$store.getters['ads/myAds']
    }
  }
}
</script>