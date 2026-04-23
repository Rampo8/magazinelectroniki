<template>
  <v-container>
    <h1 class="mb-4">📦 Мои заказы</h1>

    <!-- Индикатор загрузки -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Сообщение об ошибке -->
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </v-alert>

    <!-- Если заказов нет -->
    <v-alert v-else-if="orders.length === 0" type="info" variant="tonal">
      У вас пока нет заказов. 
      <router-link to="/products">Перейти в каталог</router-link> и начните покупки!
    </v-alert>

    <!-- Список заказов -->
    <v-row v-else>
      <v-col v-for="order in orders" :key="order.id" cols="12" md="6" lg="4">
        <v-card 
          class="mb-3" 
          elevation="2"
          :class="{ 'border-cart': order.status === 'cart' }"
          :color="order.status === 'cart' ? 'grey-lighten-4' : undefined"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              {{ order.status === 'cart' ? '🛒 Корзина' : 'Заказ #' + order.id }}
            </span>
            <v-chip :color="getStatusColor(order.status)" size="small" variant="tonal">
              {{ getStatusLabel(order.status) }}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="text-caption">
            📅 {{ formatDate(order.created_at || order.createdAt || order.order_date) }}
          </v-card-subtitle>

          <v-card-text>
            <div v-for="item in order.items" :key="item.id" class="mb-2 pb-2 border-bottom">
              <div class="d-flex justify-space-between">
                <strong>{{ item.product?.name || 'Товар удалён' }}</strong>
                <span>{{ item.quantity }} шт.</span>
              </div>
              <div class="text-caption text-right">
                {{ (item.price_at_purchase || item.price || 0) * item.quantity }} ₽
              </div>
              
              <v-btn v-if="item.product?.id" size="x-small" variant="text" color="primary" 
                     @click="handleAddToCart(item.product)" class="mt-1">
                ➕ Ещё
              </v-btn>
            </div>

            <div class="d-flex justify-space-between font-weight-bold mt-2">
              <span>Итого:</span>
              <span>{{ getOrderTotal(order) }} ₽</span>
            </div>
          </v-card-text>

          <v-card-actions>
            <!-- Кнопки для КОРЗИНЫ -->
            <template v-if="order.status === 'cart'">
              <!-- ✅ ИСПРАВЛЕНО: вызов без аргумента -->
              <v-btn variant="flat" color="primary" size="small" @click="checkout">
                💳 Оформить
              </v-btn>
              <v-btn variant="text" color="error" size="small" @click="clearCart(order.id)">
                🗑️ Очистить
              </v-btn>
            </template>
            
            <!-- Кнопки для ОФОРМЛЕННЫХ заказов -->
            <template v-else>
              <v-btn variant="text" size="small" @click="viewOrderDetails(order.id)">🔍 Подробнее</v-btn>
              <v-btn v-if="order.status === 'new'" variant="text" size="small" color="error" 
                     @click="cancelOrder(order.id)">✕ Отменить</v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top>
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "UserOrdersView",
  data() {
    return {
      snackbar: { show: false, text: "", color: "success" }
    }
  },
  computed: {
    orders() { return this.$store.getters["orders/orders"] || [] },
    loading() { return this.$store.getters["orders/isLoading"] },
    error() { return this.$store.getters["orders/error"] }
  },
  async mounted() {
    await this.$store.dispatch("orders/fetchOrders")
  },
  methods: {
    clearError() { this.$store.commit("orders/CLEAR_ERROR") },
    
    async handleAddToCart(product) {
      try {
        await this.$store.dispatch("orders/addToCart", { product_id: product.id, quantity: 1 })
        this.snackbar = { show: true, text: "✅ Добавлено в корзину", color: "success" }
      } catch (e) {
        this.snackbar = { show: true, text: e.message || "Ошибка", color: "error" }
      }
    },

    // 🔹 Оформить корзину (✅ ИСПРАВЛЕНО: убран параметр orderId)
    async checkout() {
      if (!confirm('Оформить заказ? Товары будут списаны со склада.')) return;
      try {
        // Экшен сам найдёт корзину по user_id из стора
        await this.$store.dispatch("orders/checkout")
        await this.$store.dispatch("orders/fetchOrders")
        this.snackbar = { show: true, text: "🎉 Заказ оформлен!", color: "success" }
      } catch (e) {
        this.snackbar = { show: true, text: e.message || "Ошибка оформления", color: "error" }
      }
    },

    // 🔹 Очистить корзину
    async clearCart(orderId) {
      if (!confirm('Удалить все товары из корзины?')) return;
      try {
        const order = this.orders.find(o => o.id === orderId);
        if (order?.items) {
          for (const item of order.items) {
            await this.$store.dispatch("orders/removeFromCart", item.id);
          }
          await this.$store.dispatch("orders/fetchOrders");
          this.snackbar = { show: true, text: "🗑️ Корзина очищена", color: "warning" }
        }
      } catch (e) {
        this.snackbar = { show: true, text: e.message || "Ошибка", color: "error" }
      }
    },

    async cancelOrder(orderId) {
      if(!confirm('Отменить заказ?')) return;
      try {
        await this.$store.dispatch("orders/updateOrderStatus", { orderId, status: "cancelled" })
        await this.$store.dispatch("orders/fetchOrders")
        this.snackbar = { show: true, text: "Заказ отменён", color: "warning" }
      } catch(e) {
        this.snackbar = { show: true, text: e.message || "Ошибка", color: "error" }
      }
    },

    viewOrderDetails(id) {
      console.log('View order', id);
    },

    formatDate(dateString) {
      if (!dateString) return "—";
      return new Date(dateString).toLocaleString("ru-RU", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    },

    getStatusColor(status) {
      const colors = { 
        cart: 'grey',
        new: 'blue',
        processing: 'orange',
        cancelled: 'red',
        completed: 'green'
      };
      return colors[status] || 'grey';
    },

    getStatusLabel(status) {
      const labels = {
        cart: 'В корзине',
        new: 'Новый',
        processing: 'В обработке',
        cancelled: 'Отменён',
        completed: 'Доставлен'
      };
      return labels[status] || status;
    },

    getOrderTotal(order) {
      return order.items?.reduce((sum, i) => 
        sum + (i.price_at_purchase || i.price || 0) * i.quantity, 0) || 0;
    }
  }
}
</script>

<style scoped>
.border-cart {
  border: 2px dashed #90a4ae !important;
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.border-bottom:last-child {
  border-bottom: none;
}
</style>