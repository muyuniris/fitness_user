import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dash from '../views/Dash.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/home"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/home',
    component: Home,
    children:[
      {
        path:'',
        name:'Dash',
        component:Dash,
        meta: {
          auth: true
        }
      },
      {
        path:'course',
        name:'Course',
        component:() => import('../views/Course.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'community',
        name:'Community',
        component:() => import('../views/Community.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'my',
        name:'My',
        component:() => import('../views/My.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'courseDetail:id',
        name:'CourseDetail',
        component:() => import('../views/CourseDetail.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'teacherDetail:id',
        name:'TeacherDetail',
        component:() => import('../views/TeacherDetail.vue'),
        meta: {
          auth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
