import { createRouter, createWebHistory, useRoute, type RouteRecordRaw } from 'vue-router'

import publicRoutes from './publicRoutes'
import userRoutes from './userRoutes'
import SubadminRoutes from './SubAdminRoutes'
import SuperAdminRoutes from './SuperAdminRoutes'
import { userAuthStore } from '@/stores/userAuthStore'

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

router.beforeEach((to, from, next) => {
  const authStore = userAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.token || !authStore.isUserLoggedIn) {
      return next({ name: 'Login' })
    }

    if (to.meta.role && authStore.userRole !== to.meta.role) {
      return next({ name: 'Login' })
    }

    return next()
  }

  if (
    (to.name === 'Login' || to.name === 'SignUpUser') &&
    authStore.token &&
    authStore.isUserLoggedIn
  ) {
    if (authStore.userRole === 'super_admin') {
      next({ name: 'SuperAdmin' })
    } else if (authStore.userRole === 'sub_admin') {
      next({ name: 'SubAdmin' })
    } else if (authStore.userRole === 'customer') {
      next({ name: 'EndUser' })
    }
  } else {
    return next()
  }
})

export default router
