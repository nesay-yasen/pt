import axios from 'axios'

// 统一维护后端接口前缀，构建时可通过 VITE_API_BASE 覆盖
const baseURL = import.meta.env.VITE_API_BASE || '/api'

const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.statusText ||
      error.message ||
      '网络请求失败'
    return Promise.reject(new Error(message))
  }
)

export const api = {
  getStats: () => http.get('/stats'),
  getActivities: (params) => http.get('/activities', { params }),
  getActivity: (id) => http.get(`/activities/${id}`),
  getLaws: () => http.get('/laws'),
  getAbout: () => http.get('/about'),
  sendMessage: (payload) => http.post('/messages', payload)
}

export default http
