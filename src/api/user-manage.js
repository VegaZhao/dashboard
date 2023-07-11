import axios from '@/libs/api.request'
import env from '_conf/env'

const getUserListUrl = env === 'development' ? 'getUserList' : 'dashboard/system/user-manager/user-list'
const addUserUrl = env === 'development' ? 'addUser' : 'dashboard/system/user-manager/user-add'
const delUserUrl = env === 'development' ? 'delUser' : 'dashboard/system/user-manager/user-del'
const updateUserUrl = env === 'development' ? 'updateUser' : 'dashboard/system/user-manager/user-update'
const resetUserPassUrl = env === 'development' ? 'userChangePass' : 'dashboard/system/user-manager/user-reset-pass'

export const getUserList = (startPage, pageSize, query) => {
  const data = {
    startPage,
    pageSize,
    query
  }
  return axios.request({
    url: getUserListUrl,
    data: data,
    method: 'post'
  })
}

export const addUser = (userInfo) => {
  return axios.request({
    url: addUserUrl,
    data: userInfo,
    method: 'post'
  })
}

export const delUser = (userIds) => {
  return axios.request({
    url: delUserUrl,
    data: {
      'userIds': userIds
    },
    method: 'post'
  })
}

export const updateUser = (userInfo) => {
  return axios.request({
    url: updateUserUrl,
    data: userInfo,
    method: 'post'
  })
}

export const resetUserPass = (userPassInfo) => {
  return axios.request({
    url: resetUserPassUrl,
    data: userPassInfo,
    method: 'post'
  })
}
