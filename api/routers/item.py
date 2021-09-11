import uuid
import httpx
from sqlalchemy.sql.expression import and_, asc, desc
from sqlalchemy.sql.functions import func
from starlette.background import BackgroundTasks
from dependencies import get_db, send_task
from fastapi.params import Depends
from typing import Optional
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models
import json

router = APIRouter()


@router.post("/item/{id}", summary="透過WebPage id，新增或修改此類別底下的item資料")
async def post_item_by_web_page_id(id: str, start: Optional[str] = None, end: Optional[str] = None,
 flower_apply_async: str = Depends(send_task), db: Session = Depends(get_db)
                                   ):
    if end == "" or end == None:
        end = "0"
    data = json.dumps({
        "args": [
            str(id), str(start), str(end)
        ]
    })
    headers = {
        'Content-Type': 'application/json'
    }
    req = httpx.post(f'{flower_apply_async}/tasks.update_item',
                     headers=headers,
                     data=data)
    res = req.json()
    task_id=res['task-id']
    db.add(models.WebPageTask( ID=str(uuid.uuid4()),TaskID= task_id,WebPageID=id  ))
    db.commit()
    return res


@router.delete("/item/{id}", summary="透過item id刪除特定item資料")
async def post_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    db.query(models.Item).filter(models.Item.ID == id).update({"Enable": 0})
    db.commit()
    return {"message": "已刪除資料"}


@router.get("/item/{id}", summary="透過WebPage id，取得要抓的item資料")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  db: Session = Depends(get_db)):
    offset_count = offset*limit
    data = db.query(models.Item).filter(and_(models.Item.WebPageID == id, models.Item.Enable == True)).order_by(
        desc(models.Item.Seq)).offset(offset_count).limit(limit).all()
    return data


@router.get("/item/table/{id}", summary="透過WebPage id，取得要抓的item資料 (For Table)")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  keyword: Optional[str] = None,
                                  sort: Optional[str] = None,
                                  mode: Optional[str] = None,
                                  db: Session = Depends(get_db)):
    item_data = db.query(models.Item).filter(
        and_(models.Item.WebPageID == id, models.Item.Enable == True))
    if keyword != None:
        item_data = item_data.filter(models.Item.Title.contains(keyword))
    item_data_count = item_data.count()
    offset_count = offset*limit
    if sort == None:
        data = item_data.order_by(desc(models.Item.Seq))
    else:
        if sort == 'title':
            order_column = models.Item.Seq
        if sort == 'seq':
            order_column = models.Item.Seq
        if sort == 'page':
            order_column = models.Item.Page
        if mode == 'descend':
            order_column = desc(models.Item.Seq)
        else:
            order_column = asc(models.Item.Seq)
        data = item_data.order_by(order_column)
    data = data.offset(offset_count).limit(limit).all()
    return {'totalDataCount': item_data_count, 'data': data}
