import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'EndUser',
    component: () => import('@/views/UserLayouts/UserLayouts.vue'),
    meta: { requiresAuth: true, role: 'user' },
    redirect: '/user/movielist',
    children: [
      {
        path: 'movielist',
        name: 'MovieList',
        component: () => import('@/views/MovieList.vue'),
      },
      {
        path: 'movies/:id',
        name: 'MovieDetails',
        component: () => import('@/views/MovieOverView.vue'),
      },
      {
        path: '/allMovieShowList/:movieId',
        name: 'AllMovieShowList',
        component: () => import('@/views/Shows/AllMovieShowList.vue'),
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('@/views/UserDashboard.vue'),
      },
      {
        path: 'bookings',
        name: 'UserBookings',
        component: () => import('@/views/UserBooking.vue'),
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue'),
      },
    ],
  },
]

export default userRoutes
