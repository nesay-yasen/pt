import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/varieties',
    name: 'varieties',
    component: () => import('../views/VarietiesView.vue'),
    meta: { title: '品种库' }
  },
  {
    path: '/varieties/:id',
    name: 'variety-detail',
    component: () => import('../views/VarietyDetailView.vue'),
    meta: { title: '品种详情' }
  },
  {
    path: '/prices',
    name: 'prices',
    component: () => import('../views/PricesView.vue'),
    meta: { title: '参考行情' }
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('../views/KnowledgeView.vue'),
    meta: { title: '栽培知识' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于本站' }
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
  const base = '葡萄产业信息站'
  document.title = to.meta.title ? `${to.meta.title} | ${base}` : base
})

export default router
