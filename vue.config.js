// vue.config.js
// ✅ Для Vue CLI 3/4/5 + Vuetify 2/3

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // 🔹 Порт для dev-сервера
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:6868',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },

  // 🔹 Настройки транспиляции (если нужны)
  transpileDependencies: [
    'vuetify'
  ],

  // 🔹 Алиасы для импортов @/
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },

  // 🔹 Плагин Vuetify (если используется отдельная конфигурация)
  // Если у тебя vuetify.js в src/plugins/ — этот блок можно убрать
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})