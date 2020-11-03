import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '平台首页', icon: 'dashboard', affix: true }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [


  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        hidden: true,
        name: 'Icons',
        meta: { title: '图标参考', icon: 'icon', noCache: true }
      }
    ]

  },

  {
    path: '/product-management',
    component: Layout,
    redirect: '/product-management/product-warehouse',
    alwaysShow: true, // will always show the root menu
    name: 'ProductManagement',
    meta: {
      title: '产品管理',
      icon: 'example',
      roles: ['ProductManagement5345'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'product-warehouse',
        component: () => import('@/views/product-management/product-warehouse'),
        name: 'ProductWarehouse',
        meta: {
          title: '产品仓库',
          roles: ['ProductWarehouse42343'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'update',
        component: () => import('@/views/product-management/update'),
        hidden: true,
        name: 'Update',
        meta: {
          title: '产品管理',
          roles: ['ProductEditor42352'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'for-sale',
        component: () => import('@/views/product-management/for-sale'),
        name: 'ForSale',
        meta: {
          title: '出售中',
          roles: ['ForSale43246'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'cat-product-release',
        component: () => import('@/views/product-management/cat-product-release'),
        hidden: true,
        name: 'CatProductRelease',
        meta: {
          title: '查看产品',
          roles: ['ProductView76657'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'new-product-release',
        component: () => import('@/views/product-management/new-product-release'),
        name: 'NewProductRelease',
        meta: {
          title: '发布新品',
          roles: ['NewProductRelease87453'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/product-group',
    component: Layout,
    redirect: '/product-group/page',
    alwaysShow: true, // will always show the root menu
    name: 'ProductGroup',
    meta: {
      title: '产品分组',
      icon: 'tab',
      roles: ['ProductGroup564521'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: '/page-product-group',
        component: () => import('@/views/product-group/page-product-group'),
        name: 'PageProductGroup',
        meta: {
          title: '分组管理',
          roles: ['GroupManagement9402'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/order-management',
    component: Layout,
    redirect: '/order-management/order-select-list',
    alwaysShow: true, // will always show the root menu
    name: 'OrderManagement',
    meta: {
      title: '订单管理',
      icon: 'shopping',
      roles: ['OrderManagement753463'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'cat-order-detail',
        component: () => import('@/views/order-management/cat-order-detail'),
        hidden: true,
        name: 'CatOrderDetail',
        meta: {
          title: '订单详情查看',
          roles: ['OrderView76657','OrderView52423'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'order-ship',
        component: () => import('@/views/order-management/order-ship'),
        hidden: true,
        name: 'OrderShip',
        meta: {
          title: '订单发货',
          roles: ['OrderDelivery765527'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'order-select-list',
        component: () => import('@/views/order-management/order-select-list'),
        name: 'OrderSelectList',
        meta: {
          title: '订单查询',
          roles: ['OrderSelect42343'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'after-sales-order-list',
        component: () => import('@/views/order-management/after-sales-order-list'),
        name: 'AfterSalesOrderList',
        meta: {
          title: '售后订单',
          roles: ['AfterSalesOrders422343'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'to-be-delivered-list',
        component: () => import('@/views/order-management/to-be-delivered-list'),
        name: 'ToBeDeliveredList',
        meta: {
          title: '待发货',
          roles: ['ToBeDelivered432446'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'to-be-received-list',
        component: () => import('@/views/order-management/to-be-received-list'),
        name: 'ToBeReceivedList',
        meta: {
          title: '待收货',
          roles: ['ToBeReceived634543'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'completed-list',
        component: () => import('@/views/order-management/completed-list'),
        name: 'CompletedList',
        meta: {
          title: '已完成',
          roles: ['OrderCompleted42wqe3'] // or you can only set roles in sub nav
        }
      },
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/snapped-up',
    alwaysShow: true, // will always show the root menu
    name: 'Marketing',
    meta: {
      title: '营销推广',
      icon: 'star',
      roles: ['Marketing7das63'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'poster-marketing',
        component: () => import('@/views/marketing/poster-marketing'),
        name: 'PosterMarketing',
        meta: {
          title: '海报营销',
          roles: ['PosterMarketing235423'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'hot-recommendation',
        component: () => import('@/views/marketing/hot-recommendation'),
        name: 'HotRecommendation',
        meta: {
          title: '热门推荐',
          roles: ['HotRecommendation653463'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'snapped-up',
        component: () => import('@/views/marketing/snapped-up'),
        name: 'SnappedUp',
        meta: {
          title: '限时抢购',
          roles: ['SnappedUp63564'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'add-snapped-up',
        component: () => import('@/views/marketing/add-snapped-up'),
        hidden: true,
        name: 'AddSnappedUp',
        meta: {
          title: '添加限时抢购',
          roles: ['AddSnappedUp524'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'update-snapped-up',
        component: () => import('@/views/marketing/update-snapped-up'),
        hidden: true,
        name: 'UpdateSnappedUp',
        meta: {
          title: '编辑限时抢购',
          roles: ['EditPanicBuying52414'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'coupon-management',
        component: () => import('@/views/marketing/coupon-management'),
        name: 'CouponManagement',
        meta: {
          title: '优惠券设置',
          roles: ['coupon1234'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'add-coupon',
        component: () => import('@/views/marketing/add-coupon'),
        name: 'AddCoupon',
        hidden: true,
        meta: {
          title: '创建优惠券',
          roles: ['addCoupon1234'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'update-coupon',
        component: () => import('@/views/marketing/update-coupon'),
        name: 'EditCoupon',
        hidden: true,
        meta: {
          title: '编辑优惠券',
          roles: ['editCoupon1234'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/custom-management',
    component: Layout,
    redirect: '/custom-management/custom-list',
    alwaysShow: true, // will always show the root menu
    name: 'CustomManagement',
    meta: {
      title: '定制管理',
      icon: 'size',
      roles: ['CustomManagement1252'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'custom-list',
        component: () => import('@/views/custom-management/custom-list'),
        name: 'CustomList',
        meta: {
          title: '定制管理',
          roles: ['CustomList673'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/user-list',
    alwaysShow: true, // will always show the root menu
    name: 'UserManagement',
    meta: {
      title: '用户管理',
      icon: 'peoples',
      roles: ['UserManagement6452'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'user-list',
        component: () => import('@/views/user-management/user-list'),
        name: 'UserList',
        meta: {
          title: '用户列表',
          roles: ['UserList6345'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/account-management',
    component: Layout,
    redirect: '/account-management/page-account-management',
    alwaysShow: true, // will always show the root menu
    name: 'AccountManagement',
    meta: {
      title: '权限管理',
      icon: 'user',
      roles: ['AccountManagement432456'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'page-account-management',
        component: () => import('@/views/account-management/page-account-management'),
        name: 'PageAccountManagement',
        meta: {
          title: '账户管理',
          roles: ['PageAccountManagement5233'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'add-account',
        component: () => import('@/views/account-management/add-account'),
        hidden: true,
        name: 'AddAccount',
        meta: {
          title: '添加账户',
          roles: ['AddAccount23573'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role-management',
        component: () => import('@/views/account-management/role-management'),
        name: 'RoleManagement',
        meta: {
          title: '角色管理',
          roles: ['RoleManagement5123233'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role-authorize',
        component: () => import('@/views/account-management/role-authorize'),
        hidden: true,
        name: 'RoleAuthorize',
        meta: {
          title: '授权',
          roles: ['RoleManagement5123233'] // or you can only set roles in sub nav
        }
      },

    ]
  },
  {
    // TODO
    path: '/live-management',
    component: Layout,
    redirect: '/live-management/live-center',
    alwaysShow: true, // will always show the root menu
    name: 'LiveManagement',
    meta: {
      title: '直播管理',
      icon: 'live',
      roles: ['RoleManagement5123233'] // or you can only set roles in sub nav
    },
    children: [
      {
        path: 'live-center',
        component: () => import('@/views/live-management/live-center'),
        name: 'LiveAuthorize',
        meta: {
          title: '直播中心',
          roles: ['RoleManagement5123233'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
