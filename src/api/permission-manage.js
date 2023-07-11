import axios from '@/libs/api.request'
import env from '_conf/env'

const getPermissionListUrl = env === 'development' ? 'getPermissionList' : 'dashboard/system/permission-manager/permission-list'
const getPermissionListPageUrl = env === 'development' ? 'getPermissionList' : 'dashboard/system/permission-manager/permission-list-page'
const addPermissionUrl = env === 'development' ? 'addPermission' : 'dashboard/system/permission-manager/permission-add'
const delPermissionUrl = env === 'development' ? 'delPermission' : 'dashboard/system/permission-manager/permission-del'
const updatePermissionUrl = env === 'development' ? 'updatePermission' : 'dashboard/system/permission-manager/permission-update'

export const getPermissionList = () => {
  return axios.request({
    url: getPermissionListUrl,
    method: 'get'
  })
}

export const getPermissionListPage = (startPage, pageSize, query) => {
  const data = {
    startPage,
    pageSize,
    query
  }
  return axios.request({
    url: getPermissionListPageUrl,
    data: data,
    method: 'post'
  })
}

export const addPermission = (permissionInfo) => {
  return axios.request({
    url: addPermissionUrl,
    data: permissionInfo,
    method: 'post'
  })
}

export const editPermission = (permissionInfo) => {
  return axios.request({
    url: updatePermissionUrl,
    data: permissionInfo,
    method: 'post'
  })
}

export const delPermission = (permissionIds) => {
  return axios.request({
    url: delPermissionUrl,
    data: {
      'permissionIds': permissionIds
    },
    method: 'post'
  })
}
