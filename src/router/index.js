import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Teacher/Login/index.vue'
import Home from '@/views/Teacher/Home/index.vue'
import Student from '@/views/Student/index.vue'
import StudentManage from '@/views/Teacher/Home/components/studentmanage.vue'
import OfferManage from '@/views/Teacher/Home/components/offermanage.vue'
import TeacherManage from '@/views/Teacher/Home/components/teachermanage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/student',
        component: Student
    },
    {
        path: '/',
        redirect: '/teacher/login'
    },
    {
      path: '/teacher/login',
      component: Login
    },
    {
      path: '/teacher',
      component: Home,
      children: [
        {
          path: 'studentmanage',
          component: StudentManage
        },
        {
          path: 'offermanage',
          component: OfferManage
        },
        {
          path: 'teachermanage',
          component: TeacherManage
        }
      ]
    }
  ]
})

export default router
