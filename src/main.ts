import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import './style.css';

import router from './router';
import { useUserStore } from './stores/userStore';

import { timeHelperPlugin } from './plugins/timeHelper';
import { delayDirective } from './directives/v-delay';
import { stopTypeHelperPlugin } from './plugins/stopTypeHelper';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Check for existing session before mounting router
const userStore = useUserStore();
userStore.checkLocalSession();

app.use(router);
app.use(timeHelperPlugin);
app.use(stopTypeHelperPlugin);
app.directive('delay', delayDirective);

app.mount('#app');
