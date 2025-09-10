import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    // component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'user' },
    children: [
      //       {
      //   path: '/',
      //   name: 'MovieList',
      //   component: () => import('@/views/SubAdminList/SubAdminList.vue'),
      // },
      // {
      //   path: '/movies/:id',
      //   name: 'MovieDetails',
      //   component: () => import('@/views/MovieOverView.vue'),
      // },
      //   {
      //     path: 'dashboard',
      //     name: 'UserDashboard',
      //     component: () => import('@/views/user/Dashboard.vue'),
      //   },
      //   {
      //     path: 'bookings',
      //     name: 'UserBookings',
      //     component: () => import('@/views/user/Bookings.vue'),
      //   },
      //   {
      //     path: 'profile',
      //     name: 'UserProfile',
      //     component: () => import('@/views/user/Profile.vue'),
      //   },
    ],
  },
]

export default userRoutes
