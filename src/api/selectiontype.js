import axios from '@/libs/api.request'
import env from '_conf/env'

const industryTypeUrl =  'dashboard/stat/industry-stat/industry-list'
const loanTypeUrl =  '/dashboard/stat/loan-stat/loan-list'
const testInduUrl =  'dashboard/industry-stat/test'

export const getIndustryList = () => {
    const data = {
    }
    return axios.request({
      url: industryTypeUrl,
      data,
      method: 'post'
    })
  }

  export const getLoanList = () => {
    const data = {
    }
    return axios.request({
      url: loanTypeUrl,
      data,
      method: 'post'
    })
  }

  export const testIndu = (DateFrom,DateTo) => {
    const data = {
        DateFrom,DateTo
    }
    return axios.request({
      url: testInduUrl,
      data,
      method: 'post'
    })
  }