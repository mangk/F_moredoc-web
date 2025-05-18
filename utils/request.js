import axios from 'axios' // 引入axios
import qs from 'qs'
import store from '~/store/index'

const service = axios.create({
  // baseURL: 'https://api.study.solobit.cn',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
})

// http request 拦截器
service.interceptors.request.use(
  (config) => {
    const token = store().getters['user/token'] || ''
    if (token) config.headers.authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// http response 拦截器
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log('error', error.response)
    return {
      status: error.response.status,
      data:
        error.response.data && error.response.data.message
          ? error.response.data
          : {
              message: `${error.response.status} ${error.response.statusText} ${
                error.response.data || ''
              }`,
            },
    }
  }
)

export default service
