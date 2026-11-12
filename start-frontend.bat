@echo off
chcp 65001 >nul
cd /d "%~dp0frontend"
if not exist "node_modules" (
  echo [1/2] 安装前端依赖（使用 npmmirror 镜像）...
  call npm install --registry=https://registry.npmmirror.com
)
echo [2/2] 启动前端 http://127.0.0.1:5173
call npm run dev
pause
