// vue.config.js
// ✅ Для Vue CLI / Webpack - НЕ использовать import/export!

module.exports = {
  // Порт фронтенда
  devServer: {
    port: 8081,
    
    // 🔹 Прокси для запросов к бэкенду
    proxy: {
      '/api': {
        target: 'http://localhost:6868',  // Адрес твоего бэкенда
        changeOrigin: true,  // Меняет заголовок Host на target
        secure: false,       // Разрешает self-signed SSL
        ws: true             // Поддержка WebSocket
      }
    }
  },
  
  // Если используются алиасы @/
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  }
}