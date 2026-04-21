<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" lg="8">
        <div class="d-flex justify-space-between align-center mb-4 mt-3">
          <h1 class="text-secondary">Товары</h1>
          
          <!-- 🔹 Кнопка: создать товар -->
        </div>
        <!-- 🔹 Индикатор загрузки -->
        <v-progress-linear 
          v-if="loading" 
          indeterminate 
          color="primary" 
          class="mb-4"
        />

        <!-- 🔹 Ошибка -->
        <v-alert 
          v-if="error" 
          type="error" 
          variant="tonal" 
          closable
          @click:close="clearError"
          class="mb-4"
        >
          {{ error }}
        </v-alert>
        
        <!-- 🔹 Список товаров -->
        <v-row v-if="products.length > 0">
          <v-col 
            v-for="product in products" 
            :key="product.id" 
            cols="12" 
            sm="6" 
            md="4"
          >
            <v-card 
              height="100%" 
              class="d-flex flex-column"
            >
              <!-- Заголовок + бренд -->
              <v-card-title class="pb-1">
                {{ product.name }}
                <v-chip 
                  v-if="product.brand" 
                  size="x-small" 
                  color="secondary" 
                  class="ml-2"
                >
                  {{ product.brand }}
                </v-chip>
              </v-card-title>
              
              <!-- Цена (редактируемая) -->
              <v-card-subtitle class="pt-0 text-primary font-weight-bold">
                <template v-if="editingProductId === product.id">
                  <v-text-field
                    v-model="editForm.price"
                    type="number"
                    density="compact"
                    hide-details
                    class="d-inline-block"
                    style="max-width: 120px;"
                    @click.stop
                  /> ₽
                </template>
                <template v-else>
                  {{ formatPrice(product.price) }} ₽
                </template>
              </v-card-subtitle>
              
              <!-- Характеристики/описание -->
              <v-card-text class="flex-grow-1">
                {{ product.characteristics || 'Нет описания' }}
              </v-card-text>
              
              <!-- Категория и остаток (редактируемый) -->
              <v-card-text class="pt-0">
                <v-chip 
                  v-if="getCategoryDisplay(product)" 
                  size="small" 
                  variant="outlined" 
                  class="mr-2"
                >
                  📦 {{ getCategoryDisplay(product) }}
                </v-chip>
                
                <template v-if="editingProductId === product.id">
                  <v-text-field
                    v-model="editForm.stock_quantity"
                    type="number"
                    density="compact"
                    hide-details
                    class="d-inline-block"
                    style="max-width: 80px;"
                    @click.stop
                  />
                  <v-chip size="small" color="warning" variant="tonal" class="ml-1">
                    ред.
                  </v-chip>
                </template>
                <v-chip 
                  v-else-if="getStockDisplay(product) !== null" 
                  size="small"
                  :color="getStockColor(product)"
                  variant="tonal"
                >
                  {{ getStockDisplay(product) }}
                </v-chip>
              </v-card-text>
              
              <!-- 🔹 Кнопки действий -->
              <v-card-actions class="mt-auto pt-2">
                <!-- Кнопки редактирования -->
                <template v-if="editingProductId !== product.id">
                  <v-btn 
                    color="primary" 
                    variant="tonal"
                    size="small"
                    @click.stop="startEdit(product)"
                    block
                    class="mb-2"
                  >
                    <v-icon start>mdi-pencil</v-icon>
                    Редактировать
                  </v-btn>
                  <v-btn 
                    color="info" 
                    variant="outlined"
                    size="small"
                    @click.stop="viewProduct(product.id)"
                    block
                  >
                    <v-icon start>mdi-eye</v-icon>
                    Просмотр
                  </v-btn>
                </template>
                
                <!-- Кнопки сохранения/отмены -->
                <template v-else>
                  <v-btn 
                    color="success" 
                    variant="flat"
                    size="small"
                    :loading="saving"
                    @click.stop="saveEdit(product)"
                    block
                    class="mb-2"
                  >
                    <v-icon start>mdi-check</v-icon>
                    Сохранить
                  </v-btn>
                  <v-btn 
                    color="grey" 
                    variant="outlined"
                    size="small"
                    @click.stop="cancelEdit"
                    block
                  >
                    <v-icon start>mdi-close</v-icon>
                    Отмена
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- 🔹 Пустой список -->
        <v-alert 
          v-if="!loading && products.length === 0" 
          type="info" 
          variant="tonal" 
          class="mt-4"
        >
          Товары не найдены.
          <br>
          <v-btn color="primary" size="small" class="mt-2" @click="openCreateDialog">
            Создать первый товар
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>

    <!-- 🔹 Уведомление -->
    <v-snackbar 
      v-model="snackbar.show" 
      :color="snackbar.color" 
      :timeout="3000"
      top
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Закрыть</v-btn>
      </template>
    </v-snackbar>

    <!-- 🔹 Диалог создания товара -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">➕ Новый товар</v-card-title>
        <v-card-text>
          <v-text-field v-model="createForm.name" label="Название *" required />
          <v-text-field v-model="createForm.brand" label="Бренд" />
          <v-text-field v-model="createForm.price" label="Цена *" type="number" required />
          <v-text-field v-model="createForm.stock_quantity" label="Остаток" type="number" />
          <v-textarea v-model="createForm.characteristics" label="Характеристики / Описание" rows="3" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="createDialog = false">Отмена</v-btn>
          <v-btn color="primary" :loading="saving" @click="createProduct">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'ProductsList',
  
  data() {
    return {
      snackbar: { show: false, text: '', color: 'success' },
      
      // 🔹 Редактирование
      editingProductId: null,
      editForm: { price: '', stock_quantity: '' },
      saving: false,
      
      // 🔹 Создание товара
      createDialog: false,
      createForm: {
        name: '',
        brand: '',
        price: '',
        stock_quantity: '',
        characteristics: ''
      }
    }
  },
  
  computed: {
    products() { return this.$store.getters['products/allProducts'] },
    loading() { return this.$store.getters['products/isLoading'] || this.$store.getters['shared/loading'] },
    error() { return this.$store.getters['products/error'] || this.$store.getters['shared/error'] }
  },
  
  async mounted() {
    try {
      await this.$store.dispatch('products/fetchProducts')
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  },
  
  methods: {
    formatPrice(price) {
      if (price == null) return '0'
      return Number(price).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    
    getCategoryDisplay(product) {
      if (product.category?.name) return product.category.name
      if (product.category_id) return `ID: ${product.category_id}`
      return null
    },
    
    getStockDisplay(product) {
      if (product.stock_quantity !== undefined) return product.stock_quantity > 0 ? `✓ ${product.stock_quantity} шт.` : '✗ Нет'
      if (product.quantity !== undefined) return product.quantity > 0 ? `✓ ${product.quantity} шт.` : '✗ Нет'
      return null
    },
    
    getStockColor(product) {
      const stock = product.stock_quantity ?? product.quantity
      return (stock && stock > 0) ? 'success' : 'error'
    },
    
    viewProduct(id) { this.$router.push(`/ad/${id}`) },
    
    showSuccess(text) { this.snackbar = { show: true, text, color: 'success' } },
    showError(text) { this.snackbar = { show: true, text, color: 'error' } },
    
    clearError() {
      this.$store.commit('products/CLEAR_ERROR')
      this.$store.commit('shared/clearError')
    },
    
    // ==================== 🔹 МЕТОДЫ РЕДАКТИРОВАНИЯ ====================
    
    // 🔹 Начать редактирование товара
    startEdit(product) {
      this.editingProductId = product.id
      this.editForm = {
        price: product.price,
        stock_quantity: product.stock_quantity
      }
    },
    
    // 🔹 Отменить редактирование
    cancelEdit() {
      this.editingProductId = null
      this.editForm = { price: '', stock_quantity: '' }
    },
    
    // 🔹 Сохранить изменения товара
    async saveEdit(product) {
      this.saving = true
      try {
        const updated = {
          price: Number(this.editForm.price),
          stock_quantity: Number(this.editForm.stock_quantity)
        }
        
        // Отправляем PUT-запрос на бэкенд
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        })
        
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Ошибка обновления')
        }
        
        // ✅ Обновляем товар в Vuex
        await this.$store.dispatch('products/fetchProducts')
        
        this.showSuccess('Товар обновлён!')
        this.cancelEdit()
      } catch (err) {
        this.showError(err.message)
      } finally {
        this.saving = false
      }
    },
    
    // 🔹 Открыть диалог создания
    openCreateDialog() {
      this.createForm = {
        name: '', brand: '', price: '', stock_quantity: '', characteristics: ''
      }
      this.createDialog = true
    },
    
    // 🔹 Создать новый товар
    async createProduct() {
      if (!this.createForm.name || !this.createForm.price) {
        return this.showError('Заполните название и цену')
      }
      
      this.saving = true
      try {
        const payload = {
          name: this.createForm.name,
          brand: this.createForm.brand || null,
          price: Number(this.createForm.price),
          stock_quantity: Number(this.createForm.stock_quantity) || 0,
          characteristics: this.createForm.characteristics || null
        }
        
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Ошибка создания')
        }
        
        // ✅ Обновляем список
        await this.$store.dispatch('products/fetchProducts')
        
        this.showSuccess('Товар создан!')
        this.createDialog = false
      } catch (err) {
        this.showError(err.message)
      } finally {
        this.saving = false
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
  transform: translateY(-3px); 
  box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; 
}
</style>