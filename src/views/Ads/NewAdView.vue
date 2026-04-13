<template>
  <v-container>
    <v-row>
      <v-col cols="8" offset="2">
        <h1 class="text--secondary mb-3 mt-3">Создать товар</h1>
      </v-col>
    </v-row>
    
    <v-form v-model="valid" ref="form" @submit.prevent="createAd">
      <v-text-field
        name="title"
        label="Название"
        type="text"
        v-model="title"
        :rules="[(v) => !!v || 'Название обязательно']"
      ></v-text-field>
      
      <v-textarea
        name="description"
        label="Описание"
        type="text"
        v-model="description"
        :rules="[(v) => !!v || 'Описание обязательно']"
        class="mb-3"
      ></v-textarea>
    </v-form>
    
    <v-row>
      <v-col cols="8">
        <v-switch v-model="promo" label="Добавить в промо?"></v-switch>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="8">
        <img
          src="https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
          height="150"
          class="mt-3"
          alt="Preview"
        />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="8">
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="createAd"
          :loading="loading"
          :disabled="!valid || loading"
        >
          Создать товар
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      title: "",
      description: "",
      promo: true,
      loading: false
    }
  },
  methods: {
    async createAd() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const ad = {
          title: this.title,
          desc: this.description,
          promo: this.promo
        }
        console.log(ad)
        
        try {
          // Здесь ваш API-запрос, например:
          // await this.$axios.post('/api/ads', ad)
          this.$refs.form.resetValidation()
          // Очистка формы при необходимости
        } catch (error) {
          console.error('Ошибка создания товара:', error)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>