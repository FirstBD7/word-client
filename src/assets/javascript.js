import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

// 配置axios默认值
axios.defaults.baseURL = 'http://localhost:8081/' // 根据实际后端地址修改
axios.defaults.headers.common['Content-Type'] = 'application/json'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
