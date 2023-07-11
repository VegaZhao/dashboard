import axios from '@/libs/api.request'
import env from '_conf/env'

const getRoleListPageUrl = env === 'development' ? 'getRoleListPage' : 'dashboard/system/role-manager/role-list-page'
const getRoleListUrl = env === 'development' ? 'getRoleList' : 'dashboard/system/role-manager/role-list'
const addRoleUrl = env === 'development' ? 'addRole' : 'dashboard/system/role-manager/role-add'
const editRoleUrl = env === 'development' ? 'editRole' : 'dashboard/system/role-manager/role-update'
const delRoleUrl = env === 'development' ? 'delRole' : 'dashboard/system/role-manager/role-del'

export const getRoleListPage = (startPage, pageSize, query) => {
  const data = {
    startPage,
    pageSize,
    query
  }
  return axios.request({
    url: getRoleListPageUrl,
    data: data,
    method: 'post'
  })
}

export const getRoleList = () => {
  return axios.request({
    url: getRoleListUrl,
    method: 'get'
  })
}

export const addRole = (roleInfo) => {
  return axios.request({
    url: addRoleUrl,
    data: roleInfo,
    method: 'post'
  })
}

export const editRole = (roleInfo) => {
  return axios.request({
    url: editRoleUrl,
    data: roleInfo,
    method: 'post'
  })
}

export const delRole = (roleIds) => {
  return axios.request({
    url: delRoleUrl,
    data: {
      'roleIds': roleIds
    },
    method: 'post'
  })
}
