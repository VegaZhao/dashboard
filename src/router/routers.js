/* eslint-disable indent */
import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

/**
 * 固定路由列表
 */
const constantRouterMap = [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '/20013',
    name: 'error_20013',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/20013.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

// 贷款客户 行业类型 贷款发放方式 业务品种 担保方式
/**
 * 首页
 */
const homeRouterMap = [{
  path: '/home',
  name: 'home',
  meta: {
    title: '风险画像'
  },
  component: Main,
  children: [{
    path: '/home_stat',
    name: 'home_stat',
    meta: {
      title: '风险画像',
      icon: 'ios-home',
      access: 'stat:home_stat'
    },
    component: () => import('@/view/stat/profile-stat/profile-stat.vue')

  }]
}]


// const profileRouterMap = [{
//   path: '/profile',
//   name: 'profile',
//   meta: {
//     title: '风险画像'
//   },
//   component: Main,
//   children: [{
//     path: '/profile_stat',
//     name: 'profile_stat',
//     meta: {
//       title: '风险画像',
//       icon: 'ios-water',
//       access: 'stat:profile_stat'
//     },
//     component: () => import('@/view/stat/profile-stat/profile-stat.vue')

//   }]
// }]
/**
 * 贷款客户
 */
const customerRouterMap = [{
  path: '/customer',
  name: 'customer',
  meta: {
    icon: 'md-person',
    title: '贷款客户'
  },
  component: Main,
  children: [{
    path: '/customer_stat',
    name: 'customer_stat',
    meta: {
      title: '客户统计',
      icon: 'md-stats',
      access: 'stat:customer_stat'
    },
    component: () => import('@/view/stat/customer-stat/customer-stat.vue')
  },
  {
    path: '/customer_relat',
    name: 'customer_relat',
    meta: {
      title: '客户关联',
      icon: 'md-people',
      access: 'stat:customer_relat'
    },
    component: () => import('@/view/stat/customer-relat/customer-relat.vue')
  },
  {
    path: '/customer-expire',
    name: 'customer-expire',
    meta: {
      title: '到期客户',
      icon: 'ios-funnel',
      access: 'stat:customer-expire'
    },
    component: () => import('@/view/stat/customer-expire/customer-expire.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '贷款明细',
      icon: 'logo-yen',
      access: 'stat:detail'
    },
    component: () => import('@/view/stat/detail/detail.vue')
  }]
}]


/**
 * 系统管理
 */
const systemRouterMap = [{
  path: '/system',
  name: 'system',
  meta: {
    icon: 'md-menu',
    title: '系统管理'
  },
  component: Main,
  children: [{
      path: '/user_manage',
      name: 'user_manage',
      meta: {
        title: '用户管理',
        icon: 'ios-person',
        access: 'system:user_manage'
      },
      component: () => import('@/view/system/user-manage/user-manage.vue')

    },
    {
      path: '/role_manage',
      name: 'role_manage',
      meta: {
        title: '角色管理',
        icon: 'ios-people',
        access: 'system:role_manage'
      },
      component: () => import('@/view/system/role-manage/role-manage.vue')
    },
    {
      path: '/permission_manage',
      name: 'permission_manage',
      meta: {
        title: '权限管理',
        icon: 'ios-lock',
        access: 'system:permission_manage'
      },
      component: () =>
        import('@/view/system/permission-manage/permission-manage.vue')
    }
  ]
}]

// 全体路由列表
export const routers = [
  ...constantRouterMap,
  ...homeRouterMap,
  // ...profileRouterMap,
  ...customerRouterMap,
  ...systemRouterMap
]
