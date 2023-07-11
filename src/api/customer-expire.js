import axios from '@/libs/api.request'

const getCustomerLineDataUrl = 'dashboard/stat/customer-expire/customer-expire-line'
const getCustomerTableUrl = 'dashboard/stat/customer-expire/customer-expire'
const getCustomerTableDataUrl = 'dashboard/stat/customer-expire/customer-expire-table'

export const getCustomerLineData = (dateBegin, dateEnd) => {
    const data = {
        dateBegin,
        dateEnd
    }
    return axios.request({
      url: getCustomerLineDataUrl,
      data: data,
      method: 'post'
    })
  }

  export const getCustomerTable = (dateBegin, dateEnd, dueDate,searchKey,searchValue,  startPage, pageSize) => {
    const data = {
        dateBegin,
        dateEnd,
        dueDate,searchKey,searchValue, 
        startPage,
        pageSize
    }
    return axios.request({
      url: getCustomerTableUrl,
      data: data,
      method: 'post'
    })
  }

  export const getCustomerTableData = (dateBegin, dateEnd, dueDate,searchKey,searchValue) => {
    const data = {
      dateBegin,
      dateEnd,
      dueDate,searchKey,searchValue
    }
    return axios.request({
      url: getCustomerTableDataUrl,
      data: data,
      method: 'post'
    })
  }