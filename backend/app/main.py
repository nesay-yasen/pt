"""尤鲁都斯巴格司法所普法宣传站 —— Python 后端接口。

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
    title="尤鲁都斯巴格司法所普法宣传站 API",
    description="为 Vue3 前端提供培训活动、法律知识、站点信息等数据的示例接口",
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


@app.get("/api/activities", summary="培训活动列表")
def list_activities(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    limit: Optional[int] = None,
):
    items = data.ACTIVITIES
    if category:
        items = [item for item in items if item["category"] == category]
    if keyword:
        kw = keyword.lower()
        items = [
            item
            for item in items
            if kw in item["title"].lower()
            or kw in item["summary"].lower()
            or any(kw in tag.lower() for tag in item.get("tags", []))
        ]
    if limit:
        items = items[: max(limit, 0)]
    return {"total": len(items), "items": items}


@app.get("/api/activities/{activity_id}", summary="培训活动详情")
def get_activity(activity_id: str):
    for item in data.ACTIVITIES:
        if item["id"] == activity_id:
            return item
    raise HTTPException(status_code=404, detail="活动不存在")


@app.get("/api/laws", summary="法律知识列表")
def list_laws():
    return {"total": len(data.LAWS), "items": data.LAWS}


@app.get("/api/about", summary="站点与单位信息")
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
