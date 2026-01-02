import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 配置axios
axios.defaults.baseURL = 'http://localhost:8081'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 添加请求拦截器 - 自动添加token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器 - 处理token过期
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // token过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')