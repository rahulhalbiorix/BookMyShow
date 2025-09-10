import { createRouter, createWebHistory, useRoute, type RouteRecordRaw } from 'vue-router'

import publicRoutes from './publicRoutes'
import userRoutes from './userRoutes'
import SubadminRoutes from './SubAdminRoutes'
import SuperAdminRoutes from './SuperAdminRoutes'

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...userRoutes,
  ...SubadminRoutes,
  ...SuperAdminRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
