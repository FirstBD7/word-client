import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import WordManager from '@/components/WordManager.vue'
import WordBook from '@/components/WordBook.vue'  // 导入单词本组件

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'LoginView',
      component: LoginView
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView
    },
    {
      path: '/word-manager',
      name: 'WordManager',
      component: WordManager,
      meta: { requiresAuth: true }
    },
    {
      path: '/word-book',  // 添加单词本路由
      name: 'WordBook',
      component: WordBook,
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router