import {
  login,
  logout,
  getUserInfo,
  changeUserPass
} from '@/api/user'
import {
  setToken,
  getToken,
  resloveUserInfo
} from '@/libs/util'

export default {
  state: {
    userName: '',
    nickName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    role: '',
    access: [],
    category: [],
    accessAction: [],
    hasGetInfo: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_USER: (state, userInfo) => {
      state.avatorImgPath = userInfo.avator
      state.userId = userInfo.userId
      state.userName = userInfo.userName
      state.nickName = userInfo.nickName
      state.role = userInfo.role
      state.access = userInfo.access
      state.category = userInfo.category
      state.accessAction = userInfo.action
      state.token = userInfo.token
      setToken(userInfo.token)
    },
    RESET_USER: (state) => {
      state.avatorImgPath = ''
      state.userId = ''
      state.userName = ''
      state.nickName = ''
      state.role = []
      state.access = []
      state.category = []
      state.accessAction = []
      state.token = ''
      setToken('')
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          if (res) {
            const data = res.data
            commit('SET_TOKEN', data.token)
            resolve(data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('RESET_USER')
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          if (res) {
            const data = res.data
            const userInfo = resloveUserInfo(data)
            commit('SET_USER', userInfo)
            resolve(userInfo)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    changeUserPass({ state }, { password, passwordInChangePass, passwordCheckInChangePass }) {
      return new Promise((resolve, reject) => {
        const obj = {}
        obj.userId = state.userId
        obj.password = password
        obj.passwordInChangePass = passwordInChangePass
        obj.passwordCheckInChangePass = passwordCheckInChangePass
        changeUserPass(obj).then(res => {
          if (res) {
            resolve(true)
          } else {
            reject(false)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
