import axios from 'axios'
import { notification } from 'ant-design-vue'
import { storage } from '@/utils/storage'
import { useUserStore } from '@/store/modules/user'
import { ACCESS_TOKEN_KEY } from '@/constants/cacheEnum'

const cancelToken = axios.CancelToken
const source = cancelToken.source()

/**
 * 创建 axios 实例
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 6000,
})

/**
 * 接口请求异常处理
 * @param {*} error
 * @returns
 */
const errorHandler = (error) => {
  const userStore = useUserStore()
  if (error.response) {
    const data = error.response.data
    console.log('接口请求异常处理errorHandler----->', data)

    const token =
      storage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) || ''

    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message,
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      })
      if (token) {
        userStore.login().then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
  const token = storage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) || ''

  if (token) {
    config.headers[ACCESS_TOKEN_KEY] = token
    if (config?.params) {
      config.params['token'] = token
      config.params['visitcode'] = 'AFaG3FevA5P0Y4J'
    }
  }

  config.cancelToken = source.token // 全局添加cancelToken
  return config
}, errorHandler)

/**
 * 响应拦截器
 */
request.interceptors.response.use((response) => {
  const { ret, message } = response.data
  const { config: { params = {} } = {} } = response

  const isNoShowNotifications = ['searchAdvice']

  const userStore = useUserStore()

  if (ret === 0 && !isNoShowNotifications.includes(params?.method || '')) {
    notification?.destroy()
    notification.error({
      message: '提示',
      description: message,
    })
  }

  if (ret === 9) {
    userStore.logout().then(() => {
      notification.error({
        message: '提示',
        description: message,
      })

      setTimeout(() => {
        window.location.reload()
      }, 1500)

      source.cancel('登录信息已过期') // 取消其他正在进行的请求
    })
  }
  return response.data
}, errorHandler)

export default request
