import { createRouter, createWebHistory } from 'vue-router';
import Pdf from '../components/Pdf.vue';

const routes = [
  {
    path: '/',
    name: 'Pdf',
    component: Pdf,
  },
  // Add more routes here if needed
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
