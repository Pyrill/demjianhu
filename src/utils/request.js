import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // baseURL: '',
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log(window.localStorage.getItem('user'))
    if (window.localStorage.getItem('user')) {
      config.headers['token'] = JSON.parse(window.localStorage.getItem('user')).token
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(

  response => {
    const res = response.data

    return res
  },
  error => {
    if (error.response && error.response.data && error.response.data.message === '100001') {
      store.commit.settings('STOP_TIMER')
      Message({
        message: '登录信息失效或在其他地方登录',
        type: 'error'
      })
      window.location.href = '/#/login'
      return
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
