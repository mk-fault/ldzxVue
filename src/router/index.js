import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Teacher/Login/index.vue'
import Home from '@/views/Teacher/Home/index.vue'
import Student from '@/views/Student/index.vue'
import Query from '@/views/Student/components/query.vue'
import Offer from '@/views/Student/components/offer.vue'
import StudentManage from '@/views/Teacher/Home/components/studentmanage.vue'
import OfferManage from '@/views/Teacher/Home/components/offermanage.vue'
import TeacherManage from '@/views/Teacher/Home/components/teachermanage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        redirect: '/student'
    },
    {
        path: '/student',
        component: Student,
        redirect: '/student/query', // 重定向到子路由
        children: [
            {
                path: 'query',
                component: Query
            },
            {
                path: 'offer',
                component: Offer,
                beforeEnter: (to, from, next) => {
                    if (from.path === '/student/query') {
                        next()
                    } else {
                        next('/student/query')
                    }
                }
            }
        ]
    },
    {
      path: '/teacher/login',
      component: Login,
    },
    {
      path: '/teacher',
      component: Home,
      redirect: '/teacher/studentmanage', // 重定向到子路由
      children: [
        {
          path: 'studentmanage',
          component: StudentManage,
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
