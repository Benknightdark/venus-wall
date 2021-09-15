from sqlalchemy.sql.functions import func
from sqlalchemy.sql.expression import and_, desc
from dependencies import get_db
from fastapi.params import Depends
from typing import List
from fastapi import APIRouter
from sqlalchemy.orm import Session, joinedload, lazyload, subqueryload
import uuid
from models import models, view_models

router = APIRouter()


@router.post("/webpage", summary="新增WebPage ")
async def add_web_apge(data: List[view_models.WebPageCreate], db: Session = Depends(get_db)):
    db_item_array = []
    for d in data:
        db_item_array.append(models.WebPage(**d.dict(), ID=str(uuid.uuid4())))
    db.add_all(db_item_array)
    db.commit()
    for d in db_item_array:
        db.refresh(d)
    return db_item_array


@router.get("/webpage", summary="取得要抓的所有WebPage ")
async def get_web_page(db: Session = Depends(get_db)):
    option_data = db.query(models.WebPage.ID, models.WebPage.Name,
                           models.WebPage.Url, models.WebPage.Seq, 
                           models.WebPage.Enable, models.WebPage.ForumID).filter(
        models.WebPage.Enable == True).order_by(models.WebPage.Seq).all()
    option_data_dict = [c._asdict() for c in option_data]
    root_data = db.query(
        models.Forum.ID,
        models.Forum.Name,
        models.Forum.CreatedTime,
        models.Forum.Enable,
        models.Forum.WorkerName).filter(
        models.Forum.Enable == True).order_by(models.Forum.CreatedTime).all()
    root_data_dict = [c._asdict() for c in root_data]
    for r in root_data_dict:
        r['WebPageList']=[]
        for o in option_data_dict:
            if r['ID']==o['ForumID']:
                r['WebPageList'].append(o)

    return root_data_dict


@router.get("/webpage/{id}", summary="透過id，取得要抓的WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).first()
    return data


@router.delete("/webpage/{id}", summary="透過id，刪除WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).delete()
    db.commit()
    return data


@router.put("/webpage/{id}", summary="透過id，修改WebPage ")
async def get_web_page_by_id(id: str, data: view_models.WebPageCreate, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(
        models.WebPage.ID == id).update(data.dict())
    return data


@router.get("/webpage/byForum/{id}", summary="透過ForumID，取得相關的WebPage資料 ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    stmt = db.query(
        models.WebPageTask.WebPageID,
        func.count('*').label('TaskCount')
    ).group_by(models.WebPageTask.WebPageID).subquery()
    data = db.query(
        models.WebPage.ID,
        models.WebPage.Seq,
        models.WebPage.Enable,
        models.WebPage.Name,
        models.WebPage.Url,
        models.WebPage.ForumID,
        stmt.c.TaskCount)\
        .filter(
        and_(models.WebPage.ForumID == id, models.WebPage.Enable == True))\
        .outerjoin(stmt, stmt.c.WebPageID == models.WebPage.ID)\
        .order_by(models.WebPage.Seq).all()
    return data
