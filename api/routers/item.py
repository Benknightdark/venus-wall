from sqlalchemy.sql.functions import func
from starlette.background import BackgroundTasks
from dependencies import get_db
from fastapi.params import Depends
from typing import Optional
from fastapi import APIRouter
from sqlalchemy.orm import Session
from helpers.item_helpers import ItemHandler, ItemHelper, WebPageFilter
from models import models
router = APIRouter()


def update_items(id: str, start: Optional[str], end: Optional[str], db: Session):
    print(start)
    h = ItemHandler(start, end)
    f = WebPageFilter(id)
    helper = ItemHelper(db, f, h)
    helper.process()


@router.post("/item/{id}", description="透過WebPage id，新增或修改此類別底下的item資料")
async def post_item_by_web_page_id(background_tasks: BackgroundTasks, id: str, start: Optional[str] = None, end: Optional[str] = None, db: Session = Depends(get_db)):
    background_tasks.add_task(update_items, id, start, end, db)
    return {"message": "開始抓資料"}


@router.get("/item/{id}", description="透過WebPage id，取得要抓的item資料")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  db: Session = Depends(get_db)):
    offset_count=offset*limit
    data = db.query(models.Item).filter(models.Item.WebPageID ==
                                        id).order_by((models.Item.Seq)).offset(offset_count).limit(limit).all()
    return data


@router.get("/item/table/{id}", description="透過WebPage id，取得要抓的item資料 (For Table)")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  db: Session = Depends(get_db)):
    item_data = db.query(models.Item).filter(models.Item.WebPageID == id) 
    item_data_count = item_data.count()
    offset_count=offset*limit
    data = item_data.order_by((models.Item.Seq)).offset(offset_count).limit(limit).all()
    return {'totalDataCount': item_data_count,'data': data}
