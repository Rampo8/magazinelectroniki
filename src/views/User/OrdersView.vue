<template>
  <v-container>
    <h1 class="text-secondary mb-4">📦 Каталог товаров</h1>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
    <v-alert v-if="error" type="error" variant="tonal" closable @click:close="clearError" class="mb-4">{{ error }}</v-alert>

    <!-- Пустой список -->
    <v-alert v-if="!loading && products.length === 0" type="info" variant="tonal">
      Товары не найдены.
    </v-alert>

    <!-- Сетка товаров -->
    <v-row v-else>
      <v-col 
        v-for="product in products" 
        :key="product.id" 
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card height="100%" class="d-flex flex-column">
          
          <!-- Заголовок + Бренд -->
          <v-card-title class="pb-1">
            {{ product.name }}
            <v-chip v-if="product.brand" size="x-small" color="secondary" class="ml-2">
              {{ product.brand }}
            </v-chip>
          </v-card-title>
          
          <!-- Цена -->
          <v-card-subtitle class="pt-0 text-primary font-weight-bold">
            {{ formatPrice(product.price) }} ₽
          </v-card-subtitle>
          
          <!-- Описание/Характеристики -->
          <v-card-text class="flex-grow-1">
            {{ product.characteristics || 'Нет описания' }}
          </v-card-text>
          
          <!-- Категория и Остаток -->
          <v-card-text class="pt-0">
            <v-chip v-if="product.category?.name" size="small" variant="outlined" class="mr-2">
              📦 {{ product.category.name }}
            </v-chip>
            
            <v-chip 
              v-if="product.stock_quantity !== undefined" 
              size="small"
              :color="product.stock_quantity > 0 ? 'success' : 'error'"
              variant="tonal"
            >
              {{ product.stock_quantity > 0 ? `✓ ${product.stock_quantity} шт.` : '✗ Нет' }}
            </v-chip>
          </v-card-text>
          
          <!-- Кнопка действия -->
          <v-card-actions class="mt-auto pt-2">
            <v-btn 
              color="primary" 
              variant="outlined"
              :disabled="product.stock_quantity <= 0 || loading"
              :loading="buyingProductId === product.id"
              @click="handleAction(product)"
              block
            >
              🛒 Купить
            </v-btn>
          </v-card-actions>
          
        </v-card>
      </v-col>
    </v-row>

    <!-- 🔹 Уведомление -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top>
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Закрыть</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'ProductsListView',
  
  data() {
    return {
      snackbar: { show: false, text: '', color: 'success' },
      buyingProductId: null  // Для блокировки кнопки во время запроса
    }
  },
  
  computed: {
    products() { return this.$store.getters['products/allProducts'] },
    loading() { return this.$store.getters['products/isLoading'] },
    error() { return this.$store.getters['products/error'] }
  },
  
  async mounted() {
    await this.$store.dispatch('products/fetchProducts')
  },
  
  methods: {
    formatPrice(p) { 
      return Number(p || 0).toLocaleString('ru-RU', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }) 
    },
    
    clearError() { 
      this.$store.commit('products/CLEAR_ERROR') 
    },
    
    showSuccess(text) { this.snackbar = { show: true, text, color: 'success' } },
    showError(text) { this.snackbar = { show: true, text, color: 'error' } },
    
    // 🔹 Действие при нажатии кнопки
    async handleAction(product) {
      // Проверка наличия
      if (product.stock_quantity <= 0) {
        return this.showError('Товара нет в наличии')
      }
      
      // Проверка авторизации
      const user = this.$store.getters['user/user']
      if (!user) {
        this.showError('Войдите, чтобы купить товар')
        this.$router.push('/login')
        return
      }
      
      this.buyingProductId = product.id  // Блокируем кнопку
      
      try {
        // 🔹 Прямая покупка через API (списание баланса + остатка)
        await this.$store.dispatch('products/buyProduct', {
          productId: product.id,
          quantity: 1,
          user_id: user.id  // ✅ Обязательно передаём user_id!
        })
        
        this.showSuccess(`✅ "${product.name}" успешно куплен!`)
        
        // Обновляем список товаров, чтобы показать новый остаток
        await this.$store.dispatch('products/fetchProducts')
        
      } catch (err) {
        // Показываем ошибку от бэкенда или стандартную
        this.showError(err.message || 'Ошибка при покупке')
      } finally {
        this.buyingProductId = null  // Разблокируем кнопку
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
</style>