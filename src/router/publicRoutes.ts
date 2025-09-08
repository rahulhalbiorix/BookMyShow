import type { RouteRecordRaw } from 'vue-router'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MovieList',
    component: () => import('@/views/MovieList.vue'),
  },
  //   {
  //     path: '/login',
  //     name: 'Login',
  //     component: () => import('@/views/Login.vue'),
  //   },
  //   {
  //     path: '/register',
  //     name: 'Register',
  //     component: () => import('@/views/Register.vue'),
  //   },
  //   {
  //     path: '/movies/:id',
  //     name: 'MovieDetails',
  //     component: () => import('@/views/MovieDetails.vue'),
  //   },
]

export default publicRoutes
