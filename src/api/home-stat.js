import axios from '@/libs/api.request'

const getTreeDataUrl = 'dashboard/stat/home-stat/treemapdata'

export const getTreeData = (monthBegin, monthEnd, bankType, bankName) => {
    const data = {
      monthBegin,
      monthEnd,
      bankType,
      bankName
    }
    return axios.request({
      url: getTreeDataUrl,
      data: data,
      method: 'post'
    })
  }