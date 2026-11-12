# 葡萄价格分析平台

一个关于葡萄价格与市场供需关系可视化的静态网站，由原来的 Flask 项目（`app.py` + `templates/` + `static/`）转换为纯静态页面，可直接托管在 GitHub Pages 上。

在线地址：<https://nesay-yasen.github.io/pt/>

## 页面一览

| 页面 | 文件 | 内容 |
| --- | --- | --- |
| 首页 | `index.html` | 平台介绍、数据概览入口 |
| 价格数据 | `price-data.html` | 价格表格、排序筛选、导出 |
| 市场分析 | `market-analysis.html` | 供需关系与分析图表 |
| 品种库 | `grape-varieties.html` | 鲜食与酿酒葡萄品种介绍 |
| 新闻资讯 | `news.html` / `news-detail.html` | 行业资讯列表与详情 |
| 供应大厅 | `supply-hall.html` | 供求信息展示 |
| 综合分析 | `analysis.html` | 多维度数据可视化 |
| 关于 / 联系 | `about.html` / `contact.html` | 平台说明与联系方式 |
| 用户相关 | `denglu.html`、`zhuce.html`、`wode.html`、`favorites.html`、`history.html`、`settings.html`、`security.html`、`notification.html` | 登录、注册、个人中心、收藏、历史、设置、安全、通知（前端演示逻辑） |
| 找回密码 | `forgot-password.html` | 静态说明页 |

## 目录结构

```
pt
├─ *.html                 # 各页面（原 templates/ 下的模板）
├─ auth.css / auth.js     # 登录注册页样式与逻辑
├─ static/
│  ├─ css/                # 全站样式
│  ├─ js/                 # 交互与图表脚本
│  ├─ images/             # 品种、新闻、关于等图片
│  └─ news/               # 新闻配图
└─ .github/workflows/deploy-pages.yml   # 推送到 main 自动发布到 Pages
```

## 与原 Flask 版本的差异

- 模板里 `../static/...` 的引用统一改成 `static/...`，适配仓库子路径部署（`/pt/`）。
- 页面本身是纯 HTML，不含 Jinja 变量，因此无需服务端渲染；`app.py` 的逻辑（路由跳转）已由静态文件路径替代。
- 图表库、图标库、Excel 导出库通过 CDN 加载（Chart.js、ECharts、Font Awesome、SheetJS、Leaflet）。
- 登录、收藏、历史等功能为浏览器本地存储的演示逻辑，没有真实后端与数据库。
- 补了 `forgot-password.html`，避免登录页的「找回密码」链接 404。

## 本地查看

直接双击 `index.html` 即可浏览（相对路径均已改为 `static/...`，需与 `static/` 目录同级）。
若浏览器限制了本地文件访问，可在该目录执行：

```bash
python -m http.server 8080
```

然后访问 <http://127.0.0.1:8080/>。

## 部署

推送到 `main` 分支后，GitHub Actions 会把根目录的 HTML 与 `static/` 打包发布到 GitHub Pages。
仓库 **Settings → Pages → Source** 选择 **GitHub Actions** 即可。

## 数据说明

页面中的价格、供需、新闻等数据为演示数据，非实时行情。
