<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <v-card class="elevation-12">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
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

            <v-form v-model="valid" ref="form" lazy-validation @keyup.enter="onSubmit">
              
              <!-- 🔹 Полное имя -->
              <v-text-field
                prepend-icon="mdi-account"
                label="Полное имя *"
                v-model="form.full_name"
                :rules="[v => !!v || 'Имя обязательно']"
                :disabled="loading"
                required
              />
              
              <!-- 🔹 Email (НОВОЕ) -->
              <v-text-field
                prepend-icon="mdi-email"
                label="Email *"
                type="email"
                v-model="form.email"
                :rules="emailRules"
                :disabled="loading"
                required
              />
              
              <!-- 🔹 Телефон -->
              <v-text-field
                prepend-icon="mdi-phone"
                label="Телефон *"
                v-model="form.phone"
                :rules="[
                  v => !!v || 'Телефон обязателен',
                  v => /^[\d\+\-\(\)\s]{10,}$/.test(v) || 'Введите корректный номер'
                ]"
                :disabled="loading"
                required
              />
              
              <!-- 🔹 Город (НОВОЕ - обязательное) -->
              <v-text-field
                prepend-icon="mdi-city"
                label="Город *"
                v-model="form.city"
                :rules="[v => !!v || 'Город обязателен']"
                :disabled="loading"
                required
              />
              
              <!-- 🔹 Почтовый индекс (опционально) --
              
              <-- 🔹 Пароль -->
              <v-text-field
                prepend-icon="mdi-lock"
                label="Пароль *"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                :rules="passwordRules"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :disabled="loading"
                required
              />
              
              <!-- 🔹 Подтверждение пароля -->
              <v-text-field
                prepend-icon="mdi-lock-check"
                label="Повторите пароль *"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.confirmPassword"
                :rules="confirmPasswordRules"
                :disabled="loading"
                required
              />
              
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="secondary"
              @click="onSubmit"
              :loading="loading"
              :disabled="!valid || loading"
              block
            >
              Зарегистрироваться
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center">
            <router-link to="/login" class="text-decoration-none">
              Уже есть аккаунт? Войти
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RegistrationView',
  
  data() {
    return {
      form: {
        full_name: '',
        email: '',        // 🔹 Добавили
        phone: '',
        city: '',         // 🔹 Добавили
        postal_code: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      valid: false,
      emailRules: [
        v => !!v || 'Email обязателен',
        v => /.+@.+\..+/.test(v) || 'Введите корректный email'
      ],
      passwordRules: [
        v => !!v || 'Пароль обязателен',
        v => (v && v.length >= 6) || 'Минимум 6 символов'
      ],
      confirmPasswordRules: [
        v => !!v || 'Подтвердите пароль',
        v => v === this.form.password || 'Пароли не совпадают'
      ]
    }
  },
  
  computed: {
    loading() {
      return this.$store.getters['shared/loading']
    },
    error() {
      return this.$store.getters['shared/error']
    }
  },
  
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const userData = {
          full_name: this.form.full_name,
          email: this.form.email,      // 🔹 Отправляем email
          phone: this.form.phone,
          city: this.form.city,        // 🔹 Отправляем city
          postal_code: this.form.postal_code || null,
          password: this.form.password
        }
        
        try {
          await this.$store.dispatch('user/registerUser', userData)
          this.$router.push('/login')
        } catch (err) {
          console.error('Registration failed:', err)
        }
      }
    },
    clearError() {
      this.$store.commit('shared/clearError')
    }
  }
}
</script>