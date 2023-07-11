import {
  Message
} from 'view-design'
import router from '@/router'
import Cookies from 'js-cookie'
import {
  TOKEN_KEY
} from '@/libs/util'

export const netStatusHandle = (data) => {
  switch (true) {
    case data.code === '200':
      return true
    case data.code === '400': // 服务器内部异常
      Message.error({
        content: data.msg,
        closable: true,
        duration: 10
      })
      return false
    case data.code === '401': // 权限不足
      router.replace({
        name: 'error_401'
      })
      return false
    case data.code === '501': // 请求路径不存在
      Message.error({
        content: data.msg,
        closable: true,
        duration: 10
      })
      return false
    case data.code === '20011': // 登陆已过期
      Cookies.remove(TOKEN_KEY)
      router.replace({
        name: 'login'
      })
      return false
    case data.code === '20012': // 登陆次数过多
      Message.error({
        content: data.msg,
        closable: true,
        duration: 10
      })
      return false
    case data.code === '20013': // 账户已失效
      Cookies.remove(TOKEN_KEY)
      Message.error({
        content: data.msg,
        closable: true,
        duration: 10
      })
      router.replace({
        name: 'login'
      })
      return false
    case data.code > '10000' && data.code < '50000': // 业务相关错误提示
      Message.error({
        content: data.msg,
        closable: true,
        duration: 10
      })
      return false
    default:
      Cookies.remove(TOKEN_KEY)
      return false
  }
}
