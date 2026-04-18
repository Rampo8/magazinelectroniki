<template>
  <v-dialog v-model="modal" max-width="400">
    <!-- 🔹 Активатор: кнопка Buy -->
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success" prepend-icon="mdi-cart" variant="tonal">
        Buy
      </v-btn>
    </template>

    <v-card class="pa-3">
      <v-row justify="center">
        <v-col cols="12">
          <v-card-title class="text-h6 text-primary">Do you want to buy it?</v-card-title>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12">
          <v-card-text>
            <v-text-field
              name="name" label="Your name" v-model="name"
              :disabled="localLoading" prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              name="phone" label="Your phone" v-model="phone"
              :disabled="localLoading" prepend-icon="mdi-phone"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12">
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- 🔹 18.4. Кнопки с локальным лоудером -->
            <v-btn variant="text" @click="onClose" :disabled="localLoading">Close</v-btn>
            <v-btn
              color="success" @click="onSave"
              :loading="localLoading" :disabled="localLoading"
            >Buy It!</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BuyAdModal',
  props: ['ad'],
  data() {
    return {
      modal: false,
      name: '',
      phone: '',
      localLoading: false // 🔹 Локальный индикатор загрузки
    }
  },
  methods: {
    onClose() {
      this.name = ''
      this.phone = ''
      this.modal = false
    },
    onSave() {
      if (this.name && this.phone) {
        this.localLoading = true // 🔹 Запускаем локальный лоудер
        
        this.$store.dispatch('orders/createOrder', {
          name: this.name,
          phone: this.phone,
          adId: this.ad.id,
          userId: this.ad.userId
        })
        .finally(() => {
          // 🔹 Выполнится в любом случае (успех или ошибка)
          this.localLoading = false
          this.name = ''
          this.phone = ''
          this.modal = false
        })
        .catch(err => console.log(err))
      }
    }
  }
}
</script>