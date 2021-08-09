
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models
router = APIRouter()


@router.get("/user")
async def get_image_by_item_id(db: Session = Depends(get_db)):
    data = db.query(models.Users)
    return data.first()
