import axios from 'axios'

// 获取所有单词
export const getAllWords = () => {
  return axios.get('/word/getAll')
}

// 添加单词
export const addWord = (wordData) => {
  return axios.post('/word/add', wordData)
}

// 删除单词
export const deleteWord = (wordName) => {
  return axios.delete(`/word/delete/${wordName}`)
}
