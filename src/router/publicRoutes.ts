import type { RouteRecordRaw } from 'vue-router'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Authentication/Login.vue'),
  },
  {
    path: '/signup-user',
    name: 'SignUpUser',
    component: () => import('@/views/Authentication/SignUpUser.vue'),
  },
  {
    path: '/setPassword',
    name: 'SetPassword',
    component: () => import('@/views/Authentication/SetPassword.vue'),
  },
]

export default publicRoutes
