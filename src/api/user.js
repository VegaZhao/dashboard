import axios from '@/libs/api.request'
import env from '_conf/env'

const loginUrl = env === 'development' ? 'login' : 'dashboard/login/auth'
const getInfoUrl = env === 'development' ? 'login' : 'dashboard/login/user-info'
const logoutUrl = env === 'development' ? 'logout' : 'dashboard/login/logout'
const changeUserPassUrl = env === 'development' ? 'userChangePass' : 'dm/system/user-manager/user-change-pass'

export const login = ({
  userName,
  password
}) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: loginUrl,
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  const data = {
    token
  }
  return axios.request({
    url: getInfoUrl,
    data,
    method: 'post'
  })
}

export const logout = (token) => {
  const data = {
    token
  }
  return axios.request({
    url: logoutUrl,
    data,
    method: 'post'
  })
}

export const changeUserPass = (userPassInfo) => {
  return axios.request({
    url: changeUserPassUrl,
    data: userPassInfo,
    method: 'post'
  })
}
