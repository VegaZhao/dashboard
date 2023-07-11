import axios from '@/libs/api.request'

const getAuthCompleteListUrl = '/dashboard/auto-complete'

/**
 * 获取自动提示信息
 * @param {*} type 数据源类型
 * @param {*} prefix 前缀
 */
export const getAuthCompleteList = (type, prefix) => {
  const data = {
    type,
    prefix
  }
  return axios.request({
    url: getAuthCompleteListUrl,
    data: data,
    method: 'post'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
