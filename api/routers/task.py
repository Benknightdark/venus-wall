import httpx
from sqlalchemy.sql.expression import and_, asc, desc
from sqlalchemy.sql.functions import func
from starlette.background import BackgroundTasks
from dependencies import get_db, send_task,task_info
from fastapi.params import Depends
from typing import Optional
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models
import json

router = APIRouter()

@router.get("/task/{id}", summary="取得此task id的爬蟲最新工作狀態")
async def get_item_by_web_page_id(id: str,
                                  flower_task_info: str = Depends(task_info)):
    req = httpx.get(f'{flower_task_info}/{id}')
    print(req.text)
    res = req.json()
    return res                                  