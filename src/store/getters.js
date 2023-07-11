import {
  routers
} from '@/router/routers'
import {
  getMenuByRouter
} from '@/libs/util'

const getters = {
  role: state => state.user.role, // 用户角色
  menuList: state => getMenuByRouter(routers, state.user.access), // 左侧导航菜单显示
  breadCrumbList: state => state.app.breadCrumbList, // 面包屑导航内容
  errorCount: state => state.errorList.length
}
export default getters
