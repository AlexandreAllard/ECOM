import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/tailwind.css';
import VueChartkick from 'vue-chartkick';
import 'chart.js';


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueChartkick.use(Chartkick));

pinia.use(({ store }) => {
    if (store.$id === 'auth') {
        store.initialiseStore();
    }
});

console.log(import.meta.env.VITE_API_ENDPOINT);
console.log(import.meta.env.VUE_APP_API_ENDPOINT);

app.mount('#app');
