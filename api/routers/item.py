import logging
import uuid
import httpx
from sqlalchemy.sql.expression import and_, asc, desc, or_
from dependencies import get_db
from fastapi.params import Depends
from typing import Optional
from fastapi import APIRouter
from sqlalchemy.orm import Session, joinedload
from models import models
from dapr_httpx.pubsub_api import PubSubApi

router = APIRouter()


@router.post("/item/{id}", summary="透過WebPage id，新增或修改此類別底下的item資料")
async def post_item_by_web_page_id(id: str, start: Optional[str] = None, end: Optional[str] = None,
                                   db: Session = Depends(get_db)
                                   ):
    web_page_data = db.query(models.WebPage).filter(
        models.WebPage.ID == id).first()
    forum_worker_name = db.query(models.Forum).filter(
        models.Forum.ID == web_page_data.ForumID).first().WorkerName
    if end == "" or end == None:
        end = "0"
    pubsub_api=PubSubApi('pubsub')
    req=await pubsub_api.publish(f"{forum_worker_name}?metadata.ttlInSeconds=120",payload={
        "ID": str(id),
        "Name": web_page_data.Name,
        "Url": web_page_data.Url,
        "Start": str(start),
        "End": str(end),
    })
    logging.info(req)

    db.add(models.WebPageTask(ID=str(uuid.uuid4()),
           TaskID=str(uuid.uuid4()), WebPageID=id))
    db.commit()
    return {"message": "ok"}


@router.delete("/item/{id}", summary="透過item id刪除特定item資料")
async def post_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    db.query(models.Item).filter(models.Item.ID == id).update({"Enable": 0})
    db.commit()
    return {"message": "已刪除資料"}


@router.get("/item", summary="透過WebPage id，取得要抓的item資料 (for dashboard)")
async def get_item_by_web_page_id( offset: int, limit: int, filterId: Optional[str] = None,id: Optional[str] =None,
                                  db: Session = Depends(get_db)):
    offset_count = offset*limit
    sort_mode=models.Item.Seq
    if filterId == None:
        if id!=None:
            clause = and_(*[models.Item.WebPageID == id,
                      models.Item.Enable == True])
        else:
            clause = models.Item.Enable == True 
            sort_mode=models.Item.ModifiedDateTime

    else:
        filterId_array = or_(
            *list(map(lambda x: models.Item.ID == x, filterId.split(','))))
        clause = filterId_array

    data = db.query(models.Item).options(joinedload(models.Item.WebPageSimilarity)).options(joinedload(models.Item.ItemWebPageID_U)).filter(clause).order_by(
        desc(sort_mode)).offset(offset_count).limit(limit).all()
    return data


@router.get("/item/table/{id}", summary="透過WebPage id，取得要抓的item資料 (For Table)")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  keyword: Optional[str] = None,
                                  sort: Optional[str] = None,
                                  mode: Optional[str] = None,
                                  db: Session = Depends(get_db)):
    item_data = db.query(models.Item).filter(
        and_(models.Item.WebPageID == id, models.Item.Enable == True))
    if keyword != None : #or keyword != ''
        item_data = item_data.filter(models.Item.Title.contains(keyword))
    item_data_count = item_data.count()
    offset_count = offset*limit
    if sort == '':
        data = item_data.order_by(desc(models.Item.Seq))
    else:
        if sort == 'title':
            order_column = models.Item.Seq
        if sort == 'seq':
            order_column = models.Item.Seq
        if sort == 'page':
            order_column = models.Item.Page
        if mode == 'DESC':
            order_column = desc(models.Item.Seq)
        else:
            order_column = asc(models.Item.Seq)
        data = item_data.order_by(order_column)
    data = data.options(joinedload(models.Item.WebPageSimilarity)).offset(
        offset_count).limit(limit).all()
    return {'totalDataCount': item_data_count, 'data': data}


@router.get("/item/page-title/{id}", summary="透過WebPage id，當前頁面的標題資料 (For Item Page)")
async def get_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).options(joinedload(
        models.WebPage.WebPageForumID_U)).filter(models.WebPage.ID == id).first()
    return data
