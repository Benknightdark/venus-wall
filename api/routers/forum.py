from typing import Optional
from sqlalchemy import func
from sqlalchemy.sql.expression import and_, desc, false, or_, asc
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter, Request
from sqlalchemy.orm import Session
from models import models, view_models
from datetime import datetime
import uuid

router = APIRouter()


@router.get("/forum", summary="取得所有論壇資料")
async def get_item_by_web_page_id(db: Session = Depends(get_db)):
    forum_data = db.query(models.Forum)
    data = forum_data.filter(models.Forum.Enable ==
                             True).order_by(desc(models.Forum.CreatedTime)).all()
    return data


@router.get("/forum/{id}", summary="透過id，取得要抓的論壇資料")
async def get_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.Forum).filter(models.Forum.ID == id).one()
    return data


@router.delete("/forum/{id}", summary="透過id，刪除特定的論壇資料")
async def get_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    db.query(models.Forum).filter(models.Forum.ID == id).update({"Enable": 0})
    db.query(models.WebPage).filter(
        models.WebPage.ForumID == id).update({"Enable": 0})
    db.commit()
    return {"message": "刪除成功"}


@router.post("/forum", summary="新增壇論和看版資料")
async def post_item_by_web_page_id(requests: Request, db: Session = Depends(get_db)):
    data = await requests.json()
    new_seq = db.query(func.max(models.Forum.Seq)).scalar()+1
    data['forum']['CreatedTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data['forum']['Seq'] = new_seq
    data['forum']['Enable'] = True
    db.add(models.Forum(**data['forum']))
    if len(data['webPageList']) != None:
        db_web_page_array = []
        for d in data['webPageList']:
            db_web_page_array.append(models.WebPage(**d))
        db.add_all(db_web_page_array)
    db.commit()
    return {"message": "新增成功"}


@router.put("/forum", summary="修改壇論和看版資料")
async def put_item_by_web_page_id(requests: Request, db: Session = Depends(get_db)):
    data = await requests.json()
    data['forum']['CreatedTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    db.query(models.Forum).filter(
        models.Forum.ID == str(data['forum']['ID']).upper()).update(data['forum'])
    new_web_page_data = data['webPageList']
    if len(new_web_page_data) == 0:
        db.query(models.WebPage).filter(models.WebPage.ForumID == str(data['forum']['ID']).upper()).update({
            "Enable": False
        })
    else:
        web_page_data = db.query(models.WebPage).filter(
            models.WebPage.ForumID == str(data['forum']['ID']))
        for n in new_web_page_data:
            selected_web_page_data = web_page_data.filter(
                models.WebPage.ID == str(n["ID"]).upper())

            if len(selected_web_page_data.all()) > 0:
                # 更新
                n.pop('TaskCount')
                selected_web_page_data.update(n)  # n
            else:
                # 新增
                db.add(models.WebPage(**n))
        # 刪除
        for n in web_page_data.all():
            exsist_web_page_data = list(filter(lambda x: str(
                x["ID"]).upper() == str(n.ID).upper(), new_web_page_data))
            if len(exsist_web_page_data) == 0:
                db.query(models.WebPage).filter(
                    models.WebPage.ID == n.ID).update({"Enable": False})
    db.commit()
    return {"message": "修改成功"}


@router.get("/forum-table", summary="分頁查詢forum")
async def get_forum_fro_table(offset: int, limit: int,
                              keyword: Optional[str] = None,
                              sort: Optional[str] = None,
                              mode: Optional[str] = None,
                              db: Session = Depends(get_db)):
    forum_data = db.query(models.Forum).filter(models.Forum.Enable == True)
    if keyword != None:
        forum_data = forum_data.filter(models.Forum.Name.contains(keyword))
    forum_data_count = forum_data.count()
    offset_count = offset*limit
    if sort == None:
        data = forum_data.order_by(desc(models.Forum.CreatedTime))
    else:
        if sort == 'Name':
            order_column = models.Forum.Name
        if sort == 'Seq':
            order_column = models.Forum.Seq
        if sort == 'WorkerName':
            order_column = models.Forum.WorkerName
        if sort == 'CreatedTime':
            order_column = models.Forum.CreatedTime
        if mode == 'descend':
            order_column = desc(sort)
        else:
            order_column = asc(sort)
        data = forum_data.order_by(order_column)
    data = data.offset(
        offset_count).limit(limit).all()
    print(data)
    return {'totalDataCount': forum_data_count, 'data': data}
