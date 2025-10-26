import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */

/* Router demo */
import componentsRouter from './demo/components'
import chartsRouter from './demo/charts'
import tableRouter from './demo/table'
import nestedRouter from './demo/nested'
import {
  guideRouter, permissionRouter, iconRouter, exampleRouter, tabRouter,
  errorRouter, errorLogRouter, excelRouter, zipRouter,
  pdfRouter, pdfDownloadRouter, themeRouter, clipboardRouter, i18nRouter,
} from './demo/other'

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location:any) {
  const a:any = originalPush.call(this, location);
  return a.catch((err:any) => err)
}

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/verify',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/verify.vue'),
    meta: { hidden: true }
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/video',
    component: () => import(/* webpackChunkName: "video" */ '@/views/guide/video.vue'),
    meta: { hidden: true }
  },
  {
    path: '/excel2',
    component: () => import(/* webpackChunkName: "excel" */ '@/views/guide/excel.vue'),
    meta: { hidden: true }
  },
  {
    path: '/login/:type',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/agreement',
    component: () => import(/* webpackChunkName: "excel" */ '@/views/guide/agreement.vue'),
    name: 'agreement',
    meta: { hidden: true }
  },
  {
    path: '/agreement/:type(\\d+)?',
    component: () => import(/* webpackChunkName: "excel" */ '@/views/guide/agreement.vue'),
    name: 'agreementDetail',
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },

]

/**
 * demoRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const demoRoutes: RouteConfig[] = [
  guideRouter,
  permissionRouter,
  iconRouter,
  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  tableRouter,
  nestedRouter,
  exampleRouter, tabRouter,
  errorRouter, errorLogRouter, excelRouter, zipRouter,
  pdfRouter, pdfDownloadRouter, themeRouter, clipboardRouter, i18nRouter,
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/demo/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
]

// cd-key路由
export const cdkeyRoutes: RouteConfig[] = [
  //KEY交易市场
  {
    path: '/cdkey',
    component: Layout,
    redirect: '/cdkey/gamelist',
    children: [
      {
        path: 'gamelist',
        component: () => import(/* webpackChunkName: "gameList" */ '@/views/cdkey/index.vue'),
        name: 'gameList',
        meta: { title: 'gameList', icon: 'Key' }
      },
      {
        path: 'gameDetail/:gameId(\\d+)?',
        component: () => import(/* webpackChunkName: "gameDetail" */ '@/views/cdkey/detail.vue'),
        name: 'gameDetail',
        meta: { title: 'gameDetail', icon: 'Key', hidden: true, activeMenu: '/cdkey/gamelist' }
      },
      {
        path: 'gamePrice/:sellerId(\\d+)?',
        component: () => import(/* webpackChunkName: "gamePrice" */ '@/views/cdkey/price.vue'),
        name: 'gamePrice',
        meta: { title: 'gamePrice', icon: 'Key', hidden: true, activeMenu: '/cdkey/gamelist' }
      },
      {
        path: 'gameOrder/:orderId(\\d+)?',
        component: () => import(/* webpackChunkName: "gameOrder" */ '@/views/cdkey/order.vue'),
        name: 'gameOrder',
        meta: { title: 'gameOrder', icon: 'Key', hidden: true, activeMenu: '/cdkey/gamelist' }
      },
      {
        path: 'gameSetting/:orderId(\\d+)?',
        component: () => import(/* webpackChunkName: "gameSetting" */ '@/views/cdkey/setting.vue'),
        name: 'gameSetting',
        meta: { title: 'gameSetting', icon: 'Key', hidden: true, activeMenu: '/cdkey/gamelist' }
      },
      {
        path: 'gameStatus/:orderId(\\d+)?',
        component: () => import(/* webpackChunkName: "gameStatus" */ '@/views/cdkey/status.vue'),
        name: 'gameStatus',
        meta: { title: 'gameStatus', icon: 'Key', hidden: true, activeMenu: '/cdkey/gamelist' }
      }
    ]
  },
]

// 买家路由
export const buyerRoutes: RouteConfig[] = [
  {
    path: '/buyer',
    component: Layout,
    redirect: '/buyer/info',
    meta: { title: 'buyerPortal', icon: 'buyer', alwaysShow: true },
    children: [
      {
        path: 'personal',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'buyerPersonal',
        meta: { title: 'personal', icon: 'usercenter' }
      },
      {
        path: 'account',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'buyerAccount',
        meta: { title: 'accountSettings', icon: 'setting' }
      },
      {
        path: 'orderList',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/buyer/order-list.vue'),
        name: 'buyerOrderList',
        meta: { title: 'orderList', icon: 'orders' }
      },
      {
        path: 'orderDetail/:orderId(\\d+)?',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/buyer/order-detail.vue'),
        name: 'buyerOrderDetail',
        meta: { title: 'orderDetail', icon: 'orders', hidden: true, activeMenu: '/buyer/orderList'  }
      },
      {
        path: 'purchased',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'purchasedGames',
        meta: { title: 'purchasedGames', icon: 'bought' }
      },
      {
        path: 'wishList',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'wishList',
        meta: { title: 'wishList', icon: 'wishlist' }
      },
    ]
  },
]

// 卖家路由
export const sellerRoutes: RouteConfig[] = [
  {
    path: '/seller',
    component: Layout,
    redirect: '/seller/info',
    meta: { title: 'sellerPortal', icon: 'seller', alwaysShow: true },
    children: [
      {
        path: 'personal',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/seller.vue'),
        name: 'sellerPersonal',
        meta: { title: 'personal', icon: 'usercenter' }
      },
      {
        path: 'orderList',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/order-list.vue'),
        name: 'sellerOrderList',
        meta: { title: 'orderList', icon: 'orders' }
      },
      {
        path: 'orderList/:gameId(\\d+)?',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/order-list.vue'),
        name: 'sellerOrderListByGameId',
        meta: { title: 'orderList', icon: 'orders', hidden: true, activeMenu: '/seller/orderList'  }
      },
      {
        path: 'orderDetail/:orderId(\\d+)?',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/order-detail.vue'),
        name: 'sellerOrderDetail',
        meta: { title: 'orderDetail', icon: 'orders', hidden: true, activeMenu: '/seller/orderList'  }
      },
      {
        path: 'sale',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/sale-list.vue'),
        name: 'sale',
        meta: { title: 'saleManagement', icon: 'sell' }
      },
      {
        path: 'saleDetail/:gameId(\\d+)?',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/sale-detail.vue'),
        name: 'saleDetail',
        meta: { title: 'saleDetailManagement', icon: 'sell', hidden: true, activeMenu: '/seller/sale'  }
      },
      {
        path: 'addCdkey',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/seller/add-cdkey.vue'),
        name: 'addCdkey',
        meta: { title: 'addCdkey', icon: 'sell', hidden: true, activeMenu: '/seller/sale'  }
      },
      {
        path: 'withdrawal',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'withdrawal',
        meta: { title: 'withdrawalManagement', icon: 'withdraw' }
      },
      {
        path: 'token',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'token',
        meta: { title: 'tokenManagement', icon: 'token' }
      },
    ]
  },
]


// 帮助路由
export const aboutRoutes: RouteConfig[] = [
  {
    path: '/about',
    component: Layout,
    redirect: '/about/info',
    meta: { title: 'aboutInfo', icon: 'info', alwaysShow: true },
    children: [
      {
        path: 'aboutUs',
        component: () => import(/* webpackChunkName: "statisticsChart" */ '@/views/dashboard/index.vue'),
        name: 'aboutUs',
        meta: { title: 'aboutUs', icon: 'about' }
      },
    ]
  },
]

// other路由
export const otherRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/cdkey/gamelist',
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/cdkey/gamelist',
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
]
console.log(44333, constantRoutes)
const createRouter = () => new VueRouter({
  mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
