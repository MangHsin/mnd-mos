import { createApp } from 'vue'
import { createPinia } from 'pinia' // 正确导入 createPinia
import App from './App.vue'
// import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')