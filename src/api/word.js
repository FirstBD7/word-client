import axios from 'axios'

// 获取所有单词
// export const getAllWords = () => {
//   return axios.get('/word/getAll')
// }

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