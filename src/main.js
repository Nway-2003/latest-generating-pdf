// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins'; // Import the registerPlugins function

const app = createApp(App);

registerPlugins(app); // Register plugins

app.mount('#app');
