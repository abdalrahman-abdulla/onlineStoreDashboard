import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import('@/views/dashboard/Dashboard'),
      },
      // Pages
      {
        name: 'User Profile',
        path: 'pages/user',
        component: () => import('@/views/dashboard/pages/UserProfile'),
      },
      {
        name: 'Notifications',
        path: 'components/notifications',
        component: () => import('@/views/dashboard/component/Notifications'),
      },
      {
        name: 'Icons',
        path: 'components/icons',
        component: () => import('@/views/dashboard/component/Icons'),
      },
      {
        name: 'Typography',
        path: 'components/typography',
        component: () => import('@/views/dashboard/component/Typography'),
      },
      // Tables
      {
        name: 'Category',
        path: 'categories',
        component: () => import('@/views/dashboard/pages/category'),
      },
      {
        name: 'SubCategory',
        path: 'subcategories',
        component: () => import('@/views/dashboard/pages/subcategory'),
      },
      {
        name: 'Items',
        path: 'items',
        component: () => import('@/views/dashboard/pages/items'),
      },
      {
        name: 'Orders',
        path: 'orders',
        component: () => import('@/views/dashboard/pages/orders'),
      },
      // Maps
      {
        name: 'Google Maps',
        path: 'maps/google-maps',
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
      },
    ],
    meta: {
      secure: true,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/dashboard/pages/login'),
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.secure)) {
    if (!store.getters.get_token) {
      next({
        path: '/login',
      })
    } else {
      store.dispatch('me').then((res) => {
          if (res.data.user_type === 0) {
            next()
          } else {
            next({
              path: '/login',
            })
          }
        })
    }
  } else {
    next()
  }
})
export default router
