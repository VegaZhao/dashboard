import axios from '@/libs/api.request'

const fileDownloadUrl = '/dashboard/file/download/'

export const getFileDownload = (type) => {
  return axios.request({
    url: fileDownloadUrl,
    data: {
      type: type
    },
    method: 'post',
    responseType: 'blob'
  })
}
