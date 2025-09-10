import type { RouteRecordRaw } from 'vue-router'

const SuperAdminRoutes: RouteRecordRaw[] = [
  {
    path: '/superAdmin',
    name: 'SuperAdmin',
    component: () => import('@/components/SuperNavbar.vue'),
    meta: { requiresAuth: true, role: 'Super_Admin' },
    redirect: '/superAdmin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'SuperAdminDashboard',
        component: () => import('@/views/SubAdminList/SubAdminList.vue'),
      },
      {
        path: 'register-subadmin',
        name: 'RegisterSubAdmin',
        component: () => import('@/views/RegisterSubAdmin/RegisterSubAdmin.vue'),
      },
    ],
  },
]

export default SuperAdminRoutes
