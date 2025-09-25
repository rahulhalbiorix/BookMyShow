import type { RouteRecordRaw } from 'vue-router'

const SubadminRoutes: RouteRecordRaw[] = [
  {
    path: '/subadmin',
    name: 'SubAdmin',
    component: () => import('@/components/SubNavbar.vue'),
    meta: { requiresAuth: true, role: 'sub_admin' },
    redirect: '/subadmin/theaterList',
    children: [
      {
        path: 'theaterList',
        name: 'TheaterList',
        component: () => import('@/views/Theater/Theater.vue'),
      },
      {
        path: 'theaterDetailes/:id',
        name: 'TheaterDetailes',
        component: () => import('@/views/Theater/TheaterDetailes.vue'),
      },
      {
        path: 'screenList/:id',
        name: 'ScreenList',
        component: () => import('@/views/Screens/ScreenList.vue'),
      },
      {
        path: '/showList',
        name: 'ShowList',
        component: () => import('@/views/Shows/ShowList.vue'),
      },
      {
        path: '/modifyShowList/:id?',
        name: 'modifyShowList',
        component: () => import('@/views/Shows/AddEditShow.vue'),
      },
      {
        path: '/seat-layout/admin/:id',
        name: 'AdminSeatLayout',
        component: () => import('@/views/SeatLayout/AdminSeatLayout.vue'),
      },
      {
        path: '/seat-layout/create/:id',
        name: 'CreateSeatLayout',
        component: () => import('@/views/SeatLayout/CreateSeatLayout.vue'),
      },

      {
        path: 'viewScreen/:id',
        name: 'ViewScreen',
        component: () => import('@/views/Screens/viewScreenDetail.vue'),
      },
    ],
  },
]

export default SubadminRoutes
