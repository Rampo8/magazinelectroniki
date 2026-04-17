<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registration</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                prepend-icon="mdi-account"
                name="email"
                label="Email"
                type="email"
                v-model="email"
                :rules="emailRules"
                :disabled="loading"
              ></v-text-field>
              
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                :rules="passwordRules"
                :disabled="loading"
              ></v-text-field>
              
              <v-text-field
                prepend-icon="mdi-lock"
                name="confirm-password"
                label="Confirm Password"
                type="password"
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                :disabled="loading"
              ></v-text-field>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- 🔹 Кнопка с loading и disabled -->
            <v-btn
              color="primary"
              @click="onSubmit"
              :loading="loading"
              :disabled="!valid || loading"
            >
              Create Account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more or equal than 6 characters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Password confirmation is required',
        v => v === this.password || 'Passwords should match'
      ]
    }
  },
  
  computed: {
    // 🔹 Получение loading из shared module
    loading() {
      return this.$store.getters['shared/loading']
    }
  },
  
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        }
        
        try {
          // 🔹 Dispatch с async/await
          await this.$store.dispatch('user/registerUser', user)
          // 🔹 Успех — редирект
          this.$router.push("/")
        } catch (err) {
          // 🔹 Ошибка обрабатывается в store и отображается через snackbar
          console.log(err)
        }
      }
    }
  }
}
</script>