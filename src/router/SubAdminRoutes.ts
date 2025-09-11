import type { RouteRecordRaw } from 'vue-router'

const SubadminRoutes: RouteRecordRaw[] = [
  {
    path: '/subadmin',
    name: 'SubAdmin',
    component: () => import('@/components/SubNavbar.vue'),
    meta: { requiresAuth: true, role: 'Subadmin' },
    redirect: '/subadmin/theaterList',
    children: [
      {
        path: 'theaterList',
        name: 'TheaterList',
        component: () => import('@/views/Theater/Theater.vue'),
      },
    ],
  },
]

export default SubadminRoutes
