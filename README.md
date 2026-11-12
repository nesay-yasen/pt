# 尤鲁都斯巴格司法所普法宣传站

一个用于练手和演示的**简易全栈网站**：Vue 3 + Vite 前端（组合式 API + 多页面路由 + axios），Python FastAPI 后端提供接口。

## 技术栈

| 层次 | 选型 |
| --- | --- |
| 前端框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建工具 | Vite 6 |
| 路由 | vue-router 4（History 模式，5 个页面 + 404） |
| 网络请求 | axios（统一实例 + 响应拦截器） |
| 后端 | Python 3 + FastAPI + Uvicorn |
| 接口文档 | 自动生成 OpenAPI，访问 `/docs` |

## 目录结构

```
O_O_O
├─ frontend/                  # Vue3 + Vite 前端
│  ├─ src/api/index.js        # axios 实例与接口封装
│  ├─ src/router/index.js     # 路由表
│  ├─ src/views/              # 首页 / 活动列表 / 活动详情 / 法律知识 / 关于 / 404
│  └─ src/components/NavBar.vue
├─ backend/                   # Python FastAPI 后端
│  ├─ app/main.py             # 接口实现
│  ├─ app/data.py             # 示例数据
│  └─ requirements.txt
├─ start-backend.bat          # 一键启动后端（自动建虚拟环境、装依赖）
└─ start-frontend.bat         # 一键启动前端（自动装依赖）
```

## 快速开始

需要本机已安装 **Node.js 18+** 与 **Python 3.10+**。

1. 双击 `start-backend.bat`，后端运行在 <http://127.0.0.1:8000>，接口文档 <http://127.0.0.1:8000/docs>。
2. 双击 `start-frontend.bat`，浏览器打开 <http://127.0.0.1:5173>。

Vite 已配置 `/api` 代理到 `127.0.0.1:8000`，前端无需处理跨域。

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| GET | `/api/stats` | 首页统计数据 |
| GET | `/api/activities` | 活动列表，支持 `keyword`、`category`、`limit` |
| GET | `/api/activities/{id}` | 活动详情 |
| GET | `/api/laws` | 法律知识条目 |
| GET | `/api/about` | 单位与联系方式 |
| POST | `/api/messages` | 提交在线留言（示例，内存存储） |

## 打包部署

```bash
cd frontend
npm install --registry=https://registry.npmmirror.com
npm run build      # 产物在 frontend/dist
```

若前后端分开部署，构建前设置后端地址：`VITE_API_BASE=https://你的后端域名/api`。

## 说明

站内数据为演示用示例数据，联系方式等字段为占位内容，正式上线前请替换为真实信息。
