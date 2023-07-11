import axios from '@/libs/api.request'

const gettimelineUrl = 'worklog/gettimeline'

export const getTimeLineData = () => {
  const data = {
  }
  return axios.request({
    url: gettimelineUrl,
    data: data,
    method: 'post'
  })
}
