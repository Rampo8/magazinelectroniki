<template>
  <v-container>
    <h2 class="mb-4">Управление товарqweами</h2>

    <v-alert v-if="error" type="error" closable @click:close="clearError">{{ error }}</v-alert>

    <v-card class="mb-6 pa-4">
      <h4 class="mb-2">Добавить товар</h4>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field 
            v-model="form.name" 
            label="Название *" 
            required 
            :disabled="loading"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field 
            v-model="form.brand" 
            label="Бренд" 
            :disabled="loading"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field 
            v-model="form.price" 
            label="Цена *" 
            type="number" 
            required 
            :disabled="loading" 
            min="0"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field 
            v-model="form.stock" 
            label="Остаток" 
            type="number" 
            :disabled="loading" 
            min="0"
          />
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-end">
          <v-btn 
            color="primary" 
            :loading="loading" 
            :disabled="!isValid" 
            @click="handleCreate" 
            block
          >
            Выставить на продажу
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- 🔹 Characteristics (простой текст, вместо description) -->
      <v-textarea 
        v-model="form.characteristics" 
        label="Характеристики" 
        rows="3" 
        :disabled="loading"
        hint="Описание характеристик товара"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const form = ref({ 
  name: '', 
  brand: '',
  price: '', 
  stock: '',
  characteristics: ''  // ✅ Просто текст (не JSON!)
})

const loading = computed(() => 
  store.getters['products/isLoading'] || store.getters['shared/loading']
)
const error = computed(() => 
  store.getters['products/error'] || store.getters['shared/error']
)

const isValid = computed(() => 
  form.value.name?.trim() && form.value.price && Number(form.value.price) > 0
)

const handleCreate = async () => {
  if (!isValid.value) {
    alert('Заполните название и цену')
    return
  }
  
  try {
    const productData = {
      name: form.value.name.trim(),
      brand: form.value.brand.trim() || null,
      price: Number(form.value.price),
      stock_quantity: form.value.stock ? Number(form.value.stock) : 0,
      characteristics: form.value.characteristics.trim() || null  // ✅ Отправляем как текст
    }
    
    await store.dispatch('products/createProduct', productData)
    
    // Очистка формы
    form.value = { 
      name: '', 
      brand: '',
      price: '', 
      stock: '',
      characteristics: ''
    }
    alert('Товар создан!')
    
  } catch (e) {
    console.error('Ошибка:', e)
  }
}

const clearError = () => {
  store.commit('products/CLEAR_ERROR')
  store.commit('shared/clearError')
}
</script>