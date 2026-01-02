import axios from 'axios'

// 用户登录
export const login = (userData) => {
  return axios.post('/user/login', userData)
}
