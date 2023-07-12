import axios from '@/libs/api.request'

const getsystemlistUrl = 'profile/system-list'

export const getSystemList = () => {
  const data = {
  }
  return axios.request({
    url: getsystemlistUrl,
    data: data,
    method: 'post'
  })
}
