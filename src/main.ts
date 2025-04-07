import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const store=createPinia()
store.use(piniaPluginPersistedstate)
app.use(store)
app.mount('#app')
