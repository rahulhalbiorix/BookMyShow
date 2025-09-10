import type { RouteRecordRaw } from 'vue-router'

const SubadminRoutes: RouteRecordRaw[] = [
  {
    path: '/subadmin',
    name: 'SubAdmin',
    component: () => import('@/components/VerticalNavbar2.vue'),
    meta: { requiresAuth: true, role: 'Subadmin' },
    children: [],
  },
]

export default SubadminRoutes
