import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Personalization from '../views/Personalization.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
      // meta: { requiresGuest: true } // Para replicar GuestGuard
    },
    {
      path: '/registro',
      name: 'register',
      component: Register
      // meta: { requiresGuest: true } // Para replicar GuestGuard
    },
    {
      path: '/personalization',
      name: 'personalization',
      component: Personalization,
      // meta: { requiresAuth: true }, // Para replicar AuthGuard
      children: [
        { path: '', redirect: { name: 'personalization-landing' } },
        {
          path: 'landing',
          name: 'personalization-landing',
          component: LandingPage
        },
        {
          path: 'login-preview',
          name: 'personalization-login-preview',
          component: Login
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router 