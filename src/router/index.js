import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Teacher/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/teacher/login',
      component: Login
    },
    {
      
    }
  ]
})

export default router
