"""葡萄产业信息站 —— Python 后端接口。

启动：uvicorn app.main:app --reload --port 8000（在 backend 目录下执行）
文档：http://127.0.0.1:8000/docs
"""

from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import data

app = FastAPI(
    title="葡萄产业信息站 API",
    description="为 Vue3 前端提供品种库、参考行情、栽培知识与站点信息等数据的示例接口",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MESSAGES: list[dict] = []


class MessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=40, description="留言人姓名")
    message: str = Field(min_length=1, max_length=500, description="留言内容")


@app.get("/api/health", summary="健康检查")
def health():
    return {"status": "ok", "time": datetime.now().isoformat(timespec="seconds")}


@app.get("/api/stats", summary="首页统计数据")
def get_stats():
    return {"items": data.STATS}


@app.get("/api/varieties", summary="品种列表")
def list_varieties(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    limit: Optional[int] = None,
):
    items = data.VARIETIES
    if category:
        items = [item for item in items if item["category"] == category]
    if keyword:
        kw = keyword.lower()
        items = [
            item
            for item in items
            if kw in item["name"].lower()
            or kw in item["summary"].lower()
            or any(kw in tag.lower() for tag in item.get("tags", []))
        ]
    if limit:
        items = items[: max(limit, 0)]
    return {"total": len(items), "items": items}


@app.get("/api/varieties/{variety_id}", summary="品种详情")
def get_variety(variety_id: str):
    for item in data.VARIETIES:
        if item["id"] == variety_id:
            return item
    raise HTTPException(status_code=404, detail="品种不存在")


@app.get("/api/prices", summary="参考行情列表")
def list_prices(
    variety: Optional[str] = None,
    region: Optional[str] = None,
):
    items = data.PRICES
    if variety:
        items = [item for item in items if item["variety"] == variety]
    if region:
        items = [item for item in items if region in item["region"]]
    return {"total": len(items), "items": items}


@app.get("/api/knowledge", summary="栽培知识列表")
def list_knowledge():
    return {"total": len(data.KNOWLEDGE), "items": data.KNOWLEDGE}


@app.get("/api/about", summary="站点信息与联系方式")
def get_about():
    return data.ABOUT


@app.post("/api/messages", summary="提交在线留言")
def create_message(payload: MessageIn):
    MESSAGES.append(
        {
            "name": payload.name,
            "message": payload.message,
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }
    )
    return {"message": "留言已提交，感谢您的反馈。", "count": len(MESSAGES)}
