import axios from '@/libs/api.request'

const getMultiStatUrl = 'dashboard/stat/customer-stat/multi-stat'
// const getGroupListUrl = 'dashboard/stat/customer-stat/group-list'
const getCustListUrl = 'dashboard/stat/customer-stat/cust-list'
const getTreeDataUrl = 'dashboard/stat/customer-stat/treemapdata'
const getCustomerRelatTableUrl = 'dashboard/stat/customer-stat/related-detail'
const getCustLoanBankTableUrl = 'dashboard/stat/customer-stat/loan-bank-detail'
const getCustIssueMoneySumUrl = 'dashboard/stat/customer-stat/cust-issuemoney-sum'
const getRelatIssueMoneySumUrl = 'dashboard/stat/customer-stat/relat-issuemoney-sum'
const getLoanDetailUrl = 'dashboard/stat/customer-stat/customer-loan-detail'



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


// export const getGroupList = (monthBegin, monthEnd) => {
//   const data = {
//     monthBegin,
//     monthEnd
//   }
//   return axios.request({
//     url: getGroupListUrl,
//     data: data,
//     method: 'post'
//   })
// }


export const getCustList = (monthBegin, monthEnd,custName,num) => {
  const data = {
    monthBegin,
    monthEnd,custName,num
  }
  return axios.request({
    url: getCustListUrl,
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

export const getCustomerRelat = (monthBegin, monthEnd, custName, startPage, pageSize) => {
  const data = {
    monthBegin,
    monthEnd,
    custName,
    startPage,
    pageSize
  }
  return axios.request({
    url: getCustomerRelatTableUrl,
    data: data,
    method: 'post'
  })
}



export const getCustLoanBank = (monthBegin, monthEnd, custName, startPage, pageSize) => {
  const data = {
    monthBegin,
    monthEnd,
    custName,
    startPage,
    pageSize
  }
  return axios.request({
    url: getCustLoanBankTableUrl,
    data: data,
    method: 'post'
  })
}


export const getCustIssueMoneySum = (monthBegin, monthEnd, custName) => {
  const data = {
    monthBegin,
    monthEnd,
    custName
  }
  return axios.request({
    url: getCustIssueMoneySumUrl,
    data: data,
    method: 'post'
  })
}

export const getRelatIssueMoneySum = (monthBegin, monthEnd, custName) => {
  const data = {
    monthBegin,
    monthEnd,
    custName
  }
  return axios.request({
    url: getRelatIssueMoneySumUrl,
    data: data,
    method: 'post'
  })
}

export const getLoanDetail = (monthBegin, monthEnd, custName, bankName, assureID, businessID, industryID, loanID, startPage, pageSize) => {
  const data = {
    monthBegin,
    monthEnd,
    custName,
    bankName,
    assureID, 
    businessID, 
    industryID, 
    loanID,
    startPage, 
    pageSize
  }
  return axios.request({
    url: getLoanDetailUrl,
    data: data,
    method: 'post'
  })
}

