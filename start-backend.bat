@echo off
chcp 65001 >nul
cd /d "%~dp0backend"
if not exist ".venv\Scripts\python.exe" (
  echo [1/3] 创建 Python 虚拟环境...
  python -m venv .venv
)
echo [2/3] 安装依赖...
".venv\Scripts\python.exe" -m pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
echo [3/3] 启动后端 http://127.0.0.1:8000/docs
".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause
