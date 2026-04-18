<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <h1 class="text-secondary mb-3 mt-3">Orders</h1>
        
        <v-list two-line>
          <!-- 🔹 19.2. Перебор заказов из computed свойства -->
          <v-list-item 
            v-for="order in orders" 
            :key="order.id"
          >
            <template v-slot:prepend>
              <v-list-item-action>
                <v-checkbox
                  :model-value="order.done"
                  color="primary"
                  @click="markDone(order)"
                  hide-details
                ></v-checkbox>
              </v-list-item-action>
            </template>
            
            <v-list-item-title>{{ order.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ order.phone }}</v-list-item-subtitle>
            
            <template v-slot:append>
              <v-list-item-action>
                <v-btn 
                  color="primary" 
                  variant="tonal"
                  :to="'/ad/' + order.adId"
                >
                  Open
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
        
        <v-alert 
          v-if="orders.length === 0" 
          type="info" 
          variant="tonal" 
          class="mt-4"
        >
          No orders found.
        </v-alert>
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // 🔹 19.2. Удалён блок data() с локальным массивом orders
  computed: {
    orders() {
      // Получаем отфильтрованный список из Vuex store
      return this.$store.getters['orders/orders']
    }
  },
  
  methods: {
    markDone(order) {
      // Переключаем статус выполнения
      order.done = !order.done
      console.log('Order', order.id, 'done:', order.done)
      // В реальном проекте здесь будет: this.$store.dispatch('orders/updateOrderStatus', { id: order.id, done: order.done })
    }
  }
}
</script>