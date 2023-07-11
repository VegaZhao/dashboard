import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import {
  forEach,
  hasOneOf,
  objEqual
} from '@/libs/tools'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: config.cookieExpires || 1
  })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

/**
 * @param {Array} 系统全部分类
 * @param {Array} 用户可用分类
 * @returns {Array}
 * @description 根据用户可用分类，过滤系统分类
 * @author herry
 */
export const getCategory = (systemCatetory, category) => {
  const accessedCategory = []
  systemCatetory.forEach(item => {
    if (category.indexOf(item.name) > -1) {
      accessedCategory.push(item)
    }
  })
  return accessedCategory
}

/**
 *
 * @param {*} item 用户权限
 * @param {*} access 用户权限列表
 * @author herry
 */
const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (access.indexOf(item.meta.access) > -1) return true
    else return false
  } else return true
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @param {Array} access 用户权限列表
 * @returns {Array}
 * @description 计算当前系统分类下的菜单列表
 * @author herry
 */
export const getMenuByRouter = (list, access) => {
  const res = []
  forEach(list, item => {
    // hideInMenu 可在任意一级创建
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (hasChild(item)) {
        obj.children = getMenuByRouter(item.children, access)
        if (obj.children.length) {
          res.push(obj)
        }
      } else {
        if (item.meta && item.meta.href) obj.href = item.meta.href
        if (showThisMenuEle(item, access)) res.push(obj)
      }
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 * @author herry
 */
export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    const obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    name: 'home',
    to: '/home'
  }, ...res]
}

export const getRouteTitleHandled = (route) => {
  const router = {
    ...route
  }
  const meta = {
    ...route.meta
  }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') title = meta.title(router)
    else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  if (item.meta && item.meta.title) {
    let title = item.meta.title
    if (vm.$config.useI18n) {
      if (title.includes('{{') && title.includes('}}') && vm.$config.useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
      else title = vm.$t(item.name)
    } else title = (item.meta && item.meta.title) || item.name
    return title
  }
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localSessionSave('tagNaveList', JSON.stringify(list))
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localSessionRead('tagNaveList')
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 * @author herry
 */
export const getHomeRoute = routers => {
  let i = -1
  const len = routers.length
  let homeRoute = {}
  while (++i < len) {
    const item = routers[i]
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute
  const newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else {
    newList.push({
      name,
      path,
      meta
    })
  }
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  const paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  const nameSplit = file.name.split('.')
  const format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = (evt) => {
      const data = evt.target.result // 读到的数据
      const pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    const titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      const res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode
  if (parentNode) {
    const classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    const len = ele.childNodes.length
    while (++i < len) {
      const child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

export const localSessionSave = (key, value) => {
  sessionStorage.setItem(key, value)
}

export const localSessionRead = (key) => {
  return sessionStorage.getItem(key) || ''
}

/**
 *
 * @param {*} data 待解析用户信息
 * @returns {*} userInfo 返回用户信息
 * @description 解析后端用户信息并格式化返回
 */
export const resloveUserInfo = (data) => {
  const userInfo = {}
  userInfo.userId = data.userId
  userInfo.userName = data.userName
  userInfo.nickName = data.nickName
  userInfo.avator = data.avator
  userInfo.token = data.userName
  userInfo.role = []
  userInfo.access = []
  userInfo.action = []
  userInfo.category = []
  data.roles.forEach(r => {
    userInfo.role.push(r.roleName)
    r.permissions.forEach(p => {
      if (!(userInfo.action.indexOf(p.actionCode) > -1)) {
        userInfo.action.push(p.actionCode)
        if (!(userInfo.access.indexOf(p.permissionCode) > -1)) {
          userInfo.access.push(p.permissionCode)
          const c = p.permissionCode.split(':')[0]
          if (!(userInfo.category.indexOf(c) > -1)) {
            userInfo.category.push(c)
          }
        }
      }
    })
  })
  return userInfo
}

/**
 * 获取component跳转组件信息
 * @param {*} view
 */
export const readViewInfo = (view) => {
  const val = localSessionRead(view)
  return val && val.length ? JSON.parse(localSessionRead(view)) : {}
}

/**
 * 存储component跳转组件信息
 * @param {*} view 组件名称
 * @param {*} info 组件信息
 */
export const saveViewInfo = (view, info) => {
  localSessionSave(view, JSON.stringify(info))
}

/**
 * 文件下载
 * @param {*} data 文件blob
 * @param {*} header 默认为 application/octet-stream
 * @param {*} encode 默认为 uft-8
 */
export const fileDownload = (data, headers, encode) => {
  const contentType = headers['content-type'] || 'application/octet-stream'
  encode = encode || 'utf-8'
  var blob = new Blob([data], {
    type: contentType + ';charset=' + encode
  })
  var contentDisposition = headers['content-disposition'] // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var result = patt.exec(contentDisposition)
  var filename = decodeURI(result[1])
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = filename // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = () => {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return (...args) => {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

