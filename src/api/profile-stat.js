import axios from '@/libs/api.request'

const getsystemlistUrl = 'profile/system-list'
const getVulnerabilityTableUrl = 'profile/vuln-table'

export const getSystemList = () => {
  const data = {
  }
  return axios.request({
    url: getsystemlistUrl,
    data: data,
    method: 'post'
  })
}

export const getVulnerabilityTable = (systemName, searchKey, searchValue, startPage, pageSize) => {
  const data = {
    systemName,
    searchKey,
    searchValue,
    startPage,
    pageSize
  }
  return axios.request({
    url: getVulnerabilityTableUrl,
    data: data,
    method: 'post'
  })
}
