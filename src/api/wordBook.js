import axios from 'axios'

// 添加单词本
export const addWordBook = (bookData) => {
  return axios.post('/wordBook/addWord', bookData)
}

// 获取单词本列表
export const getWordBooks = (userName) => {
  return axios.get('/wordBook/getAll', {
    params: {
      userName
    }
  })
}

// 获取单词本详情
export const getWordBookDetail = (bookName, userId) => {
  return axios.get('/wordBook/getAll', {
    params: {
      bookName,
      userId
    }
  })
}
