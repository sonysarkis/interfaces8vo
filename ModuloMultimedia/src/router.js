import { createRouter, createWebHistory } from 'vue-router';
import VideoCarousel from './components/VideoCarousel.vue';
import HelloWorld from './components/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld,
  },
  {
    path: '/carrusel',
    name: 'Carrusel',
    component: VideoCarousel,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
