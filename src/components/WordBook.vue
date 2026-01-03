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

      <!-- 单词本列表卡片 -->
      <div class="card book-list-card">
        <h2 class="card-title">我的单词本列表</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="wordBooks.length === 0" class="empty-state">
          <p>暂无单词本数据</p>
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
import { getWordBookDetail } from '@/api/wordBook'

export default {
  name: 'WordBook',
  data() {
    return {
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
    async fetchWordBooks() {
      this.loading = true
      try {
        // 直接设置默认单词本
        this.wordBooks = [{
          bookName: '单词本',
          wordCount: 0
        }]
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
        const userName = localStorage.getItem('userName')
        const response = await getWordBookDetail('单词本', userName)
        if (response.data && response.data.success) {
          this.bookWords = response.data.data || []
          // 更新单词本的单词数量
          this.wordBooks[0].wordCount = this.bookWords.length
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

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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