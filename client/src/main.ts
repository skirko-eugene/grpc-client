import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createRouterApp } from './router';

const app = createApp(App)
app.use(VueQueryPlugin)

const router = createRouterApp()
app.use(router)

app.mount('#app')
