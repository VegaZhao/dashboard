import {
  constantRouterMap,
  asyncRouterMap
} from '@/router/routers'
import {
  filterAsyncRouter
} from '@/libs/util'

export default {
  state: {
    category: [], // 系统功能分类
    router: constantRouterMap, // 所有路由，包含静态和动态
    addRouters: [] // 动态路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.router = constantRouterMap.concat(routers)
    },
    SET_CATEGORY: (state, category) => {
      state.category = category
    }
  },
  actions: {
    generateRouters({
      commit
    }, permissionInfo) {
      return new Promise((resolve) => {
        const role = permissionInfo.role
        const menus = permissionInfo.menus
        // 更新用户权限内路由
        let accessedRouters
        if (role.indexOf('admin') > -1) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }

}
