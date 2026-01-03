<template>
  <div class="word-manager">
    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1 class="title">单词管理系统</h1>
          <button @click="logout" class="btn-logout">退出登录</button>
        </div>
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
            :key="word.wordName" 
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
        
        <!-- 分页控件 -->
        <div v-if="total > 0" class="pagination">
          <button 
            @click="prevPage" 
            class="btn btn-pagination"
            :disabled="loading || currentPage === 1"
          >
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} / {{ totalPages }} 页，共 {{ total }} 条记录
          </span>
          <button 
            @click="nextPage" 
            class="btn btn-pagination"
            :disabled="loading || currentPage === totalPages"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWordList, addWord, deleteWord } from '@/api/word'

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
      // 分页相关数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    }
  },
  mounted() {
    this.fetchWords()
  },
  methods: {
    async fetchWords() {
      this.loading = true
      try {
        const response = await getWordList(this.currentPage, this.pageSize)
        if (response.data && response.data.success) {
          this.words = response.data.data.items || []
          this.total = response.data.data.total || 0
          this.totalPages = Math.ceil(this.total / this.pageSize)
        } else {
          this.words = []
          this.total = 0
          this.totalPages = 0
          console.error('获取单词列表失败:', response.data.errMsg)
          alert('获取单词列表失败: ' + (response.data.errMsg || '未知错误'))
        }
      } catch (error) {
        console.error('获取单词列表失败:', error)
        alert('获取单词列表失败，请检查后端服务是否正常运行')
        this.words = []
        this.total = 0
        this.totalPages = 0
      } finally {
        this.loading = false
      }
    },
    async addWord() {
      this.loading = true
      try {
        const response = await addWord(this.newWord)
        if (response.data && response.data.success) {
          // 重新加载当前页数据
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
      if (!wordName) {
        alert('无法删除未命名的单词')
        return
      }
      
      if (!confirm(`确定要删除单词 "${wordName}" 吗？`)) {
        return
      }
      
      this.loading = true
      try {
        const response = await deleteWord(wordName)
        if (response.data && response.data.success) {
          // 重新加载当前页数据
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
    },
    logout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        this.$router.push('/login')
      }
    },
    // 分页相关方法
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchWords()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchWords()
      }
    }
  }
}
</script>

<style scoped>
/* 原有样式保持不变，添加header-content和btn-logout样式 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.btn-logout {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

/* 其他原有样式保持不变 */
.word-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-danger:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 修改为两列布局 */
.word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.word-item {
  flex: 0 0 calc(50% - 5px); /* 两列布局，减去间距 */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
  border-left: 3px solid #667eea;
  box-sizing: border-box;
}

.word-item:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.word-info {
  flex: 1;
}

.word-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.word-meaning {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.3;
  margin-bottom: 5px;
}

.word-classify {
  color: #888;
  font-size: 0.8rem;
}

.word-classify .label {
  font-weight: 600;
}

.empty-state {
  flex: 0 0 100%;
  text-align: center;
  padding: 30px 20px;
  color: #999;
  font-size: 0.95rem;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.btn-pagination {
  background-color: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #764ba2;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
}

.page-info {
  color: #666;
  font-size: 0.85rem;
}

/* 移动设备响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .title {
    font-size: 1.5rem;
  }

  .card {
    padding: 12px;
  }

  /* 移动设备上恢复单列布局 */
  .word-item {
    flex: 0 0 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .btn-danger {
    align-self: flex-end;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>