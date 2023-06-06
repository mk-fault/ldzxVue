import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Teacher/Login/index.vue'
import Home from '@/views/Teacher/Home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/teacher/login',
      component: Login
    },
    {
      path: '/teacher',
      component: Home
    }
  ]
})

export default router
