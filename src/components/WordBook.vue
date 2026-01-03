<template>
  <div class="word-book">
    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1 class="title">我的单词本</h1>
          <div class="nav-buttons">
            <button @click="$router.push('/word-manager')" class="btn-nav">单词管理</button>
            <button @click="logout" class="btn-logout">退出登录</button>
          </div>
        </div>
        <p class="subtitle">管理您的专属单词本</p>
      </header>

      <!-- 添加单词本卡片 -->
      <div class="card add-book-card">
        <h2 class="card-title">添加新单词本</h2>
        <form @submit.prevent="addWordBook" class="add-form">
          <div class="form-group">
            <label for="bookName">单词本名称</label>
            <input 
              type="text" 
              id="bookName" 
              v-model="newBook.bookName" 
              placeholder="请输入单词本名称（默认：单词本）" 
            >
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '创建中...' : '创建单词本' }}
          </button>
        </form>
      </div>

      <!-- 单词本列表卡片 -->
      <div class="card book-list-card">
        <h2 class="card-title">我的单词本列表</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="wordBooks.length === 0" class="empty-state">
          <p>暂无单词本数据</p>
          <p>点击上方按钮创建您的第一个单词本吧！</p>
        </div>
        <div v-else class="book-list">
          <div 
            v-for="book in wordBooks" 
            :key="book.bookId || book.bookName" 
            class="book-item"
          >
            <div class="book-info">
              <h3 class="book-name">{{ book.bookName || '未命名单词本' }}</h3>
              <p class="book-words">单词数量: {{ book.wordCount || 0 }}</p>
              <p class="book-date" v-if="book.createTime">
                创建时间: {{ formatDate(book.createTime) }}
              </p>
            </div>
            <div class="book-actions">
              <button 
                @click="viewBook(book)" 
                class="btn btn-secondary"
              >
                查看单词
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 单词本详情弹窗 -->
      <div v-if="showBookDetail" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ selectedBook.bookName }} - 单词列表</h3>
            <button @click="closeModal" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <div v-if="bookLoading" class="loading">加载中...</div>
            <div v-else-if="bookWords.length === 0" class="empty-state">
              <p>该单词本暂无单词</p>
            </div>
            <div v-else class="word-list">
              <div 
                v-for="word in bookWords" 
                :key="word.wordId || word.wordName" 
                class="word-item"
              >
                <div class="word-info">
                  <h4 class="word-name">{{ word.wordName || '未命名' }}</h4>
                  <p class="word-meaning">{{ word.wordMeaning || '无释义' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addWordBook, getWordBooks, getWordBookDetail } from '@/api/wordBook'

export default {
  name: 'WordBook',
  data() {
    return {
      newBook: {
        bookName: ''
      },
      wordBooks: [],
      loading: false,
      showBookDetail: false,
      selectedBook: {},
      bookWords: [],
      bookLoading: false
    }
  },
  mounted() {
    this.fetchWordBooks()
  },
  methods: {
    async addWordBook() {
      this.loading = true
      try {
        // 如果用户没有输入名称，使用默认名称
        const bookData = {
          bookName: this.newBook.bookName || '单词本',
          userName: localStorage.getItem('userName')
        }
        
        const response = await addWordBook(bookData)
        if (response.data && response.data.success) {
          alert('单词本创建成功')
          this.newBook.bookName = '' // 清空输入框
          this.fetchWordBooks() // 刷新列表
        } else {
          alert('创建失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('创建单词本失败:', error)
        alert('创建失败，请检查网络连接或服务器状态')
      } finally {
        this.loading = false
      }
    },
    
    async fetchWordBooks() {
      this.loading = true
      try {
        const userName = localStorage.getItem('userName')
        const response = await getWordBooks(userName)
        if (response.data && response.data.success) {
          this.wordBooks = response.data.data || []
        } else {
          this.wordBooks = []
          alert('获取单词本列表失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('获取单词本列表失败:', error)
        this.wordBooks = []
      } finally {
        this.loading = false
      }
    },
    
    async viewBook(book) {
      this.selectedBook = book
      this.bookLoading = true
      this.showBookDetail = true
      
      try {
        // 这里假设后端返回的每个单词本都包含userId
        const userId = localStorage.getItem('userId') || 1 // 临时默认值，实际应该从用户信息中获取
        const response = await getWordBookDetail(book.bookName, userId)
        if (response.data && response.data.success) {
          this.bookWords = response.data.data || []
        } else {
          this.bookWords = []
          alert('获取单词本详情失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('获取单词本详情失败:', error)
        this.bookWords = []
      } finally {
        this.bookLoading = false
      }
    },
    
    closeModal() {
      this.showBookDetail = false
      this.selectedBook = {}
      this.bookWords = []
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    
    logout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.word-book {
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.btn-nav {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-nav:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-logout {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
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
  max-width: 500px;
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

.form-group input {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #3498db;
  color: white;
  padding: 8px 16px;
}

.btn-secondary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 1.1rem;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.book-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.book-info {
  flex: 1;
}

.book-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.book-words {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.book-date {
  color: #888;
  font-size: 0.85rem;
}

.book-actions {
  display: flex;
  gap: 10px;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
  background-color: #f8f9fa;
}

/* 单词列表样式 */
.word-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.word-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 3px solid #3498db;
  transition: all 0.3s ease;
}

.word-item:hover {
  background-color: #e9ecef;
  transform: translateY(-3px);
}

.word-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.word-meaning {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .card {
    padding: 20px;
  }
  
  .book-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .book-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .word-list {
    grid-template-columns: 1fr;
  }
}
</style>
