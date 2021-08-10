from starlette.background import BackgroundTasks
from dependencies import get_db
from fastapi.params import Depends
from typing import Optional
from fastapi import APIRouter
from sqlalchemy.orm import Session, backref, joinedload, lazyload, relationship, selectinload, subqueryload
from models import models
router = APIRouter()


@router.get("/forum", description="取得論壇資料")
async def get_item_by_web_page_id(db: Session = Depends(get_db)):


    data = db.query(models.WebPage).order_by(models.WebPage.Seq).as_scalar()
    #db.query(models.Forum).options(selectinload(models.Forum.WebPage)).all()
    return  data
