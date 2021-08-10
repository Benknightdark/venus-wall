from dependencies import get_db
from fastapi.params import Depends
from typing import List
from fastapi import APIRouter
from sqlalchemy.orm import Session
import uuid
from models import models, view_models

router = APIRouter()


@router.post("/webpage", description="新增WebPage ")
async def add_web_apge(data: List[view_models.WebPageCreate], db: Session = Depends(get_db)):
    db_item_array = []
    for d in data:
        db_item_array.append(models.WebPage(**d.dict(), ID=str(uuid.uuid4())))
    db.add_all(db_item_array)
    db.commit()
    for d in db_item_array:
        db.refresh(d)
    return db_item_array


@router.get("/webpage", description="取得要抓的所有WebPage ")
async def get_web_page(db: Session = Depends(get_db)):
    data = db.query(models.WebPage).order_by(models.WebPage.Seq).all()
    return data


@router.get("/webpage/{id}", description="透過id，取得要抓的WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).all()
    return data


@router.delete("/webpage/{id}", description="透過id，刪除WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).delete()
    db.commit()
    return data


@router.put("/webpage/{id}", description="透過id，修改WebPage ")
async def get_web_page_by_id(id: str, data: view_models.WebPageCreate, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(
        models.WebPage.ID == id).update(data.dict())
    return data

@router.get("/webpage/byForum/{id}", description="透過ForumID，取得相關的WebPage資料 ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(
        models.WebPage.ForumID == id).order_by(models.WebPage.Seq).all()
    return data
