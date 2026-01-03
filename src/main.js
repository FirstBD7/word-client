import Vue from 'vue'
import App from './App.vue'
import router from './router'  // 导入路由配置
import axios from 'axios'

Vue.config.productionTip = false

// 1. 先设置axios默认配置
axios.defaults.baseURL = 'http://localhost:8081'  // 改为您的后端地址
axios.defaults.withCredentials = true

// 2. 添加请求拦截器
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

// 在assets/javascript.js或main.js的响应拦截器中
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // token过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('userName')  // 同时清除userName
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 3. 将axios挂载到Vue原型
Vue.prototype.$axios = axios

// 4. 最后创建Vue实例
new Vue({
  router,  // 注册路由
  render: h => h(App),
}).$mount('#app')