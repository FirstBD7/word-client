import axios from 'axios'

// 获取单词列表（分页）
export const getWordList = (pageNo, pageSize) => {
  return axios.get('/word/getList', {
    params: {
      pageNo,
      pageSize
    }
  })
}

// 添加单词
export const addWord = (wordData) => {
  return axios.post('/word/add', wordData)
}

// 删除单词
export const deleteWord = (wordName) => {
  return axios.delete(`/word/delete/${wordName}`)
}

// 添加单词到单词本
export const addToWordBook = (wordName) => {
  const userName = localStorage.getItem('userName')
  return axios.post('/wordBook/addWord', {
    bookName: '单词本', // 默认单词本名称
    userName,
    wordName
  })
}