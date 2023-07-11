import axios from '@/libs/api.request'

const getBankListUrl = 'dashboard/stat/bank-stat/bank-list'
const getUserListUrl = 'dashboard/stat/bank-stat/overview'
const getBankTypeListUrl = 'dashboard/stat/bank-stat/bank-type-list'
const getMultiStatUrl = 'dashboard/stat/bank-stat/multi-stat'
const getTreeDataUrl = 'dashboard/stat/bank-stat/treemapdata'
const getCustTableDataUrl = 'dashboard/stat/bank-stat/custTable-list'
const getGroupRankUrl = 'dashboard/stat/bank-stat/group-rank-table'


export const getBankList = (bankType) => {
  const data = {
    bankType
  }
  return axios.request({
    url: getBankListUrl,
    data: data,
    method: 'post'
  })
}

export const getUserList = (startPage, pageSize) => {
  const data = {
    startPage,
    pageSize
  }
  return axios.request({
    url: getUserListUrl,
    data: data,
    method: 'post'
  })
}

export const getBankTypeList = () => {
  const data = {
  }
  return axios.request({
    url: getBankTypeListUrl,
    data: data,
    method: 'post'
  })
}

export const getMultiStat = (monthBegin, monthEnd, bankType, bankName) => {
  const data = {
    monthBegin,
    monthEnd,
    bankType,
    bankName
  }
  return axios.request({
    url: getMultiStatUrl,
    data: data,
    method: 'post'
  })
}

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

export const getCustTableData = (monthBegin, monthEnd, assureType, loanWay, industryType, loanType, bankType, bankName, searchKey, searchValue, startPage, pageSize) => {
  const data = {
    monthBegin,
    monthEnd,
    assureType, loanWay, industryType, loanType, bankType, bankName, searchKey, searchValue, startPage, pageSize
  }
  return axios.request({
    url: getCustTableDataUrl,
    data: data,
    method: 'post'
  })
}

export const getGroupRank = (monthBegin,monthEnd,assureType,loanWay,industryType,loanType, bankType, bankID, searchKey, searchValue, startPage, pageSize) => {
  const data = {
    monthBegin,
    monthEnd,
    assureType, loanWay,industryType,loanType, bankType, bankID, searchKey, searchValue, startPage, pageSize
  }
  return axios.request({
    url:  getGroupRankUrl,
    data: data,
    method: 'post'
  })
}

