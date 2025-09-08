import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import publicRoutes from './publicRoutes'
import userRoutes from './userRoutes'
import adminRoutes from './adminRoutes'

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...userRoutes,
  ...adminRoutes,
  // {
  // path: '/:catchAll',
  // name: 'NotFound',
  // component: () => import('@/views/NotFound.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
