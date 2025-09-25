import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'EndUser',
    component: () => import('@/views/UserLayouts/UserLayouts.vue'),
    meta: { requiresAuth: true, role: 'customer' },
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
        path: '/seat-layout/user/:id',
        name: 'UserSeatLayout',
        component: () => import('@/views/SeatLayout/UserSeatLayout.vue'),
      },

      {
        path: 'bookings',
        name: 'UserBookings',
        component: () => import('@/views/UserBooking.vue'),
      },
    ],
  },
]

export default userRoutes
