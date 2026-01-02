<template>
  <div class="word-manager">
    <div class="container">
      <header class="header">
        <h1 class="title">单词管理系统</h1>
        <p class="subtitle">高效管理您的单词库</p>
      </header>

      <div class="card add-word-card">
        <h2 class="card-title">添加新单词</h2>
        <form @submit.prevent="addWord" class="add-form">
          <div class="form-group">
            <label for="wordName">单词名称</label>
            <input 
              type="text" 
              id="wordName" 
              v-model="newWord.wordName" 
              placeholder="请输入单词" 
              required
            >
          </div>
          <!-- <div class="form-group">
            <label for="wordMeaning">单词释义</label>
            <textarea 
              id="wordMeaning" 
              v-model="newWord.wordMeaning" 
              rows="3"
            ></textarea>
          </div> -->
          <div class="form-group">
            <label for="wordClassify">单词分类</label>
            <input 
              type="text" 
              id="wordClassify" 
              v-model="newWord.wordClassify" 
              placeholder="请输入单词分类（如：greeting）" 
            >
          </div>
          <button type="submit" class="btn btn-primary">添加单词</button>
        </form>
      </div>

      <div class="card word-list-card">
        <h2 class="card-title">单词列表</h2>
        <div class="word-list">
          <div 
            v-for="word in words" 
            :key="word.wordId" 
            class="word-item"
          >
            <div class="word-info">
              <h3 class="word-name">{{ word.wordName || '未命名' }}</h3>
              <p class="word-meaning">{{ word.wordMeaning || '无释义' }}</p>
              <p class="word-classify" v-if="word.wordClassify">
                <span class="label">分类：</span>{{ word.wordClassify }}
              </p>
            </div>
            <button 
              @click="deleteWord(word.wordName)" 
              class="btn btn-danger"
              :disabled="loading"
            >
              删除
            </button>
          </div>
          <div v-if="words.length === 0" class="empty-state">
            <p>暂无单词数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WordManager',
  data() {
    return {
      words: [],
      newWord: {
        wordName: '',
        wordMeaning: '',
        wordClassify: ''
      },
      loading: false,
      baseUrl1: 'http://localhost:8081/word/getAll', // 根据实际后端地址修改
      baseUrl2: 'http://localhost:8081/word/add', // 根据实际后端地址修改
      baseUrl3: 'http://localhost:8081/word/delete' // 根据实际后端地址修改
    }
  },
  mounted() {
    this.fetchWords()
  },
  methods: {
    async fetchWords() {
      this.loading = true
      try {
        const response = await axios.get(this.baseUrl1)
        // 适配后端返回的数据格式
        if (response.data && response.data.success) {
          this.words = response.data.data
        } else {
          this.words = []
          console.error('获取单词列表失败:', response.data.errMsg)
          alert('获取单词列表失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('获取单词列表失败:', error)
        alert('获取单词列表失败，请检查后端服务是否正常运行')
        this.words = []
      } finally {
        this.loading = false
      }
    },
    async addWord() {
      this.loading = true
      try {
        const response = await axios.post(this.baseUrl2, this.newWord)
        if (response.data && response.data.success) {
          this.fetchWords()
          this.newWord = { wordName: '', wordMeaning: '', wordClassify: '' }
          alert('单词添加成功')
        } else {
          console.error('添加单词失败:', response.data.errMsg)
          alert('添加单词失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('添加单词失败:', error)
        alert('添加单词失败，请检查输入内容或后端服务')
      } finally {
        this.loading = false
      }
    },
    async deleteWord(wordName) {
    //   if (!wordName) {
    //     alert('无法删除未命名的单词')
    //     return
    //   }
      
      if (!confirm(`确定要删除单词 "${wordName}" 吗？`)) {
        return
      }
      
      this.loading = true
      try {
        const response = await axios.delete(`${this.baseUrl3}/${wordName}`)
        if (response.data && response.data.success) {
          this.fetchWords()
          alert('单词删除成功')
        } else {
          console.error('删除单词失败:', response.data.errMsg)
          alert('删除单词失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('删除单词失败:', error)
        alert('删除单词失败，请检查后端服务')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.word-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  padding: 8px 16px;
}

.btn-danger:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.word-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.word-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.word-info {
  flex: 1;
}

.word-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.word-meaning {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 8px;
}

.word-classify {
  color: #888;
  font-size: 0.85rem;
}

.word-classify .label {
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #999;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .title {
    font-size: 2rem;
  }

  .card {
    padding: 20px;
  }

  .word-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .btn-danger {
    align-self: flex-end;
  }
}
</style>