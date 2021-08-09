from dependencies import get_db
from fastapi.params import Depends
from typing import List
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models
router = APIRouter()


@router.get("/image/{id}", description="透過item id，取得要抓的image資料")
async def get_image_by_item_id(id: str,
                               db: Session = Depends(get_db)):
    data = db.query(models.Image).filter(models.Image.ItemID == id).all()
    return data
