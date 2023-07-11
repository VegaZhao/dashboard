import axios from '@/libs/api.request'

const getGroupListUrl = 'dashboard/stat/customer-stat/groupCust-list'
const getTreeDataUrl = 'dashboard/stat/customer-stat/grouptreedata'
const getMultiStatUrl = 'dashboard/stat/customer-stat/group-multi-stat'
const getGroupTableUrl = 'dashboard/stat/customer-stat/groupTable-list'




export const getGroupList = (monthBegin, monthEnd,groupName,num) => {
    const data = {
      monthBegin,
      monthEnd,groupName,num
    }
    return axios.request({
      url: getGroupListUrl,
      data: data,
      method: 'post'
    })
  }

  export const getTreeData = (monthBegin, monthEnd, custName) => {
    const data = {
      monthBegin,
      monthEnd,
      custName
    }
    return axios.request({
      url: getTreeDataUrl,
      data: data,
      method: 'post'
    })
  }

  export const getMultiStat = (monthBegin, monthEnd, custName) => {
    const data = {
      monthBegin,
      monthEnd,
      custName
    }
    return axios.request({
      url: getMultiStatUrl,
      data: data,
      method: 'post'
    })
  }

  export const getGroupTableData = (monthBegin, monthEnd, groupName, searchKey, searchValue, startPage, pageSize) => {
    const data = {
      monthBegin,
      monthEnd,
      groupName, searchKey, searchValue, startPage, pageSize
    }
    return axios.request({
      url: getGroupTableUrl,
      data: data,
      method: 'post'
    })
  }