/* eslint-disable space-before-function-paren */
import axios from 'axios'
import store from '@/store'
import {
  Message
} from 'view-design'
import {
  netStatusHandle
} from '@/libs/net-status-handle'
// import { Spin } from 'view-design'
const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: {
      responseURL
    }
  } = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) {
    store.dispatch('addErrorLog', info)
  }
}

class HttpRequest {
  // eslint-disable-next-line no-undef
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 1000 * 60 * 10, // 请求超时时间
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest' // 识别为ajax 请求
        // 'X-URL-PATH': location.pathname
      },
      // 请求时携带cookie，解决跨域问题。
      // 跨域问题也可考虑使用http-proxy-middleware中间件
      withCredentials: true
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        const {
          data
        } = res
        if (!(data instanceof Blob)) {
          if (!netStatusHandle(data)) {
            return false
          }
          return data
        } else {
          if (res.data.type === 'application/json') { // 如果返回的是BLOB，并且是json，则说明文件下载出错
            const reader = new FileReader()
            reader.readAsText(res.data, 'utf-8')
            reader.onload = (e) => {
              netStatusHandle(JSON.parse(e.target.result))
            }
            return false
          }
          return res
        }
      },
      error => {
        this.destroy(url)
        addErrorLog(error.response)
        Message.error('服务内部错误')
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    if (options.isForm) { // 判断是否需要用Form传递数据
      options.headers = {
        'Content-Type': 'multipart/form-data; charset=utf-8'
        // 'X-Requested-With': 'XMLHttpRequest' // 识别为ajax 请求
        // 'X-URL-PATH': location.pathname
      }
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
