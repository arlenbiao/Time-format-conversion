import axios from 'axios'
// import store from '@/store'
import Cookies from 'js-cookie'
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) {
//     store.dispatch('addErrorLog', info)
//   }
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Accept': 'application/vnd.openfood.v1+json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      const token = Cookies.get('token')
      let googleUrl_1 = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBEKUgdKV3VmQXgm2PXHNU06UvgbGVOne0'
      if (token && config.url.substring(0, 93) !== googleUrl_1) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      let fig = config.headers.Authorization
      if (fig) {
        Cookies.set('token', fig.split(' ')[1])
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // 设置新token
      let newtoken = res.headers.authorization
      if (newtoken) {
        Cookies.set('token', newtoken.split(' ')[1]) // 设置新token
      }
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      if (error.response.status === 401) {
        Cookies.set('token', '')
        window.location = '/login'
      }
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }

      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
