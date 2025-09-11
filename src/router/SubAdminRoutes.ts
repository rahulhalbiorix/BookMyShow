import type { RouteRecordRaw } from 'vue-router'

const SubadminRoutes: RouteRecordRaw[] = [
  {
    path: '/subadmin',
    name: 'SubAdmin',
    component: () => import('@/components/SubNavbar.vue'),
    meta: { requiresAuth: true, role: 'Subadmin' },
    redirect: '/subadmin/theoter-list',
    children: [
      {
        path: 'theoter-list',
        name: 'TheoterList',
        component: () => import('@/views/Theoter/Theoter.vue'),
      },
    ],
  },
]

export default SubadminRoutes
