from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models, view_models
from datetime import datetime

router = APIRouter()


@router.get("/forum", description="取得論壇資料")
async def get_item_by_web_page_id(db: Session = Depends(get_db)):
    data = db.query(models.Forum).all()
    return data


@router.post("/forum", description="新增壇論和看版資料")
async def post_item_by_web_page_id(data: view_models.ForumCreate, db: Session = Depends(get_db)):
    data.forum.CreatedTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    db.add(models.WebPage(**data.forum))
    if data.forumWebPageData!=None:
        db_web_page_array = []
        for d in data:
            db_web_page_array.append(models.WebPage(**d.dict()))
        db.add_all(db_web_page_array)  
    db.commit()  
    return {"message": "新增成功"}
