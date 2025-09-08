import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    // component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      //   {
      // path: 'dashboard',
      // name: 'AdminDashboard',
      // component: () => import('@/views/admin/Dashboard.vue'),
      //   },
      //   {
      //     path: 'movies',
      //     name: 'ManageMovies',
      //     component: () => import('@/views/admin/ManageMovies.vue'),
      //   },
      //   {
      //     path: 'bookings',
      //     name: 'ManageBookings',
      //     component: () => import('@/views/admin/ManageBookings.vue'),
      //   },
    ],
  },
]

export default adminRoutes
