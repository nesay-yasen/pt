# 葡萄产业信息站

一个练手用的**简易全栈网站**：Vue 3 + Vite 前端（组合式 API + 多页面路由 + axios），Python FastAPI 后端提供接口。内容围绕鲜食葡萄的品种、产区参考行情与栽培技术。

## 技术栈

| 层次 | 选型 |
| --- | --- |
| 前端框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建工具 | Vite 6 |
| 路由 | vue-router 4（Hash 模式，6 个页面 + 404，静态托管可直接用） |
| 网络请求 | axios（统一实例 + 响应拦截器，后端不可用时自动回退内置演示数据） |
| 后端 | Python 3 + FastAPI + Uvicorn |
| 接口文档 | 自动生成 OpenAPI，访问 `/docs` |
| 自动部署 | GitHub Actions → GitHub Pages（`.github/workflows/deploy-pages.yml`） |

## 页面结构

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 站点简介、统计数据、热门品种、最近行情、栽培要点 |
| `/varieties` | 品种库 | 关键词搜索 + 成熟期分类筛选 |
| `/varieties/:id` | 品种详情 | 品种特性、栽培要点、标签 |
| `/prices` | 参考行情 | 表格展示，可按品种、产区筛选 |
| `/knowledge` | 栽培知识 | 整形修剪、花果管理、土肥水、绿色防控、采后管理 |
| `/about` | 关于本站 | 站点说明 + 在线留言表单 |
| 其他 | 404 | 兜底页面，可返回首页 |

## 目录结构

```
O_O_O
├─ frontend/                  # Vue3 + Vite 前端
│  ├─ src/api/index.js        # axios 实例与接口封装
│  ├─ src/api/mock.js         # 内置演示数据（后端不可用时回退）
│  ├─ src/router/index.js     # 路由表
│  ├─ src/views/              # 首页 / 品种库 / 品种详情 / 行情 / 知识 / 关于 / 404
│  └─ src/components/NavBar.vue
├─ backend/                   # Python FastAPI 后端
│  ├─ app/main.py             # 接口实现
│  ├─ app/data.py             # 品种、行情、知识等数据
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
| GET | `/api/varieties` | 品种列表，支持 `keyword`、`category`、`limit` |
| GET | `/api/varieties/{id}` | 品种详情，不存在返回 404 |
| GET | `/api/prices` | 参考行情，支持 `variety`、`region` |
| GET | `/api/knowledge` | 栽培知识条目 |
| GET | `/api/about` | 站点说明与联系方式 |
| POST | `/api/messages` | 提交在线留言（示例，内存存储） |

## 打包部署

```bash
cd frontend
npm install --registry=https://registry.npmmirror.com
npm run build      # 产物在 frontend/dist
```

若前后端分开部署，构建前设置后端地址：`VITE_API_BASE=https://你的后端域名/api`。

## 在线演示（GitHub Pages）

仓库已内置 `.github/workflows/deploy-pages.yml`，推送到 `main` 后自动构建 `frontend` 并发布到 GitHub Pages。

首次启用需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，之后每次推送会自动更新站点。

Pages 只有静态文件、没有 Python 后端，页面会自动回退到 `src/api/mock.js` 中的内置演示数据；在本地同时启动后端时则读取真实接口。

## 数据说明

站内品种参数、产区价格和技术条目均为演示用示例数据，**不是实时行情**，正式使用前请替换为当地实际数据。
