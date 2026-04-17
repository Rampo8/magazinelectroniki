<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" offset-sm="2">
        <h1 class="text-secondary mb-3 mt-3">Create Ad</h1>
        
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            name="title" 
            label="Ad Title" 
            v-model="title"
            :rules="[v => !!v || 'Title is required']" 
            prepend-icon="mdi-format-title"
            :disabled="loading"
          ></v-text-field>
          
          <v-textarea  
            name="description" 
            label="Ad Description" 
            v-model="description"
            :rules="[v => !!v || 'Description is required']"
            class="mb-3" 
            prepend-icon="mdi-text-box-edit"
            rows="3"
            :disabled="loading"
          ></v-textarea>
        </v-form> 

        <!-- Заглушка загрузки картинки -->
        <v-btn class="mt-3 mb-3" color="warning" disabled>
          Upload <v-icon end icon="mdi-cloud-upload"></v-icon>
        </v-btn>
        <img src="https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg" height="150" class="mt-3 rounded">
        
        <v-switch v-model="promo" label="Ad to Promo?" color="primary" hide-details class="mt-3" :disabled="loading"></v-switch> 
        
        <div class="d-flex justify-end">
          <!-- 🔹 16.3. Кнопка с состоянием загрузки -->
          <v-btn 
            color="success"
            @click="createAd" 
            :loading="loading"
            :disabled="!valid || loading"
            class="mt-3"
          >
            Create Ad
          </v-btn>
        </div>   
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
      promo: false
    }
  },
  
  computed: {
    // 🔹 16.3. Получение статуса загрузки из shared модуля
    loading() {
      return this.$store.getters['shared/loading']
    }
  },
  
  methods: {
    // 🔹 16.5. Отправка action + редирект при успехе
    createAd() {
      if (this.$refs.form.validate()) {
        const ad = {
          title: this.title,
          desc: this.description,
          promo: this.promo,
          src: "https://cdn.vuetifyjs.com/images/cards/cooking.png"
        }
        
        this.$store.dispatch('ads/createAd', ad)
          .then(() => {
            // Успешно создано → переход к списку
            this.$router.push("/list")
          })
          .catch((err) => {
            console.log(err)
            // Ошибка уже отображается в глобальном Snackbar
          })
      }
    }
  }
}
</script>