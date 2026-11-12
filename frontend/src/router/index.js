import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('../views/ActivitiesView.vue'),
    meta: { title: '培训活动' }
  },
  {
    path: '/activities/:id',
    name: 'activity-detail',
    component: () => import('../views/ActivityDetailView.vue'),
    meta: { title: '活动详情' }
  },
  {
    path: '/laws',
    name: 'laws',
    component: () => import('../views/LawsView.vue'),
    meta: { title: '法律知识' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于我们' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  // 使用 hash 模式：既能在本地开发，也能直接在 GitHub Pages 等静态托管上工作，
  // 无需服务端配置 history fallback。
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const base = '尤鲁都斯巴格司法所 · 普法宣传站'
  document.title = to.meta.title ? `${to.meta.title} | ${base}` : base
})

export default router
