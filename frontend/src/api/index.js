import axios from 'axios'
import { mockData } from './mock'

// 统一维护后端接口前缀，构建时可通过 VITE_API_BASE 覆盖
const baseURL = import.meta.env.VITE_API_BASE || '/api'

const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 标记当前数据是否来自本地后端；false 表示已回退到内置演示数据
export const apiState = { online: true }

http.interceptors.response.use(
  (response) => {
    apiState.online = true
    return response.data
  },
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.statusText ||
      error.message ||
      '网络请求失败'
    return Promise.reject(new Error(message))
  }
)

/**
 * 先请求后端，失败时回退到内置演示数据。
 * 部署到 GitHub Pages 等纯静态环境时，没有后端也能正常展示内容。
 */
async function withFallback(request, fallback) {
  try {
    return await request()
  } catch (error) {
    apiState.online = false
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

function filterActivities(params = {}) {
  const { keyword, category, limit } = params
  let items = mockData.activities
  if (category) items = items.filter((item) => item.category === category)
  if (keyword) {
    const kw = keyword.toLowerCase()
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw) ||
        item.tags.some((tag) => tag.toLowerCase().includes(kw))
    )
  }
  if (limit) items = items.slice(0, limit)
  return { total: items.length, items }
}

export const api = {
  getStats: () => withFallback(() => http.get('/stats'), { items: mockData.stats }),
  getActivities: (params) =>
    withFallback(() => http.get('/activities', { params }), () => filterActivities(params)),
  getActivity: (id) =>
    withFallback(
      () => http.get(`/activities/${id}`),
      () => {
        const found = mockData.activities.find((item) => item.id === id)
        if (!found) throw new Error('活动不存在')
        return found
      }
    ),
  getLaws: () => withFallback(() => http.get('/laws'), { total: mockData.laws.length, items: mockData.laws }),
  getAbout: () => withFallback(() => http.get('/about'), mockData.about),
  sendMessage: (payload) =>
    withFallback(() => http.post('/messages', payload), {
      message: '当前为静态演示环境，留言未写入后端；启动 backend 后可真实保存。'
    })
}

export default http
