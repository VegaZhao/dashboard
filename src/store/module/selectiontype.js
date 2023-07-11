import {
    getIndustryList
  } from '@/api/selectiontype'

  export default {
    state: {
    },
    mutations: {
    },
    actions: {
      // 获取用户相关信息
      getIndustryList() {
        return new Promise((resolve, reject) => {
        getIndustryList().then(res => {
          }).catch(err => {
            reject(err)
          })
        })
      }
    }
  }
  