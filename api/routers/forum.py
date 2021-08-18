from sqlalchemy.sql.expression import false
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter, Request
from sqlalchemy.orm import Session
from models import models, view_models
from datetime import datetime

router = APIRouter()


@router.get("/forum", description="取得論壇資料")
async def get_item_by_web_page_id(db: Session = Depends(get_db)):
    data = db.query(models.Forum).all()
    return data


@router.get("/forum/{id}", description="透過id，取得要抓的論壇資料")
async def get_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.Forum).filter(models.Forum.ID == id).all()
    return data


@router.post("/forum", description="新增壇論和看版資料")
async def post_item_by_web_page_id(requests: Request, db: Session = Depends(get_db)):
    data = await requests.json()
    data['forum']['CreatedTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    db.add(models.Forum(**data['forum']))
    if len(data['webPageList']) != None:
        db_web_page_array = []
        for d in data['webPageList']:
            db_web_page_array.append(models.WebPage(**d))
        db.add_all(db_web_page_array)
    db.commit()
    return {"message": "新增成功"}


@router.put("/forum", description="修改壇論和看版資料")
async def put_item_by_web_page_id(requests: Request, db: Session = Depends(get_db)):
    data = await requests.json()
    data['forum']['CreatedTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    db.query(models.Forum).filter(
        models.Forum.ID == str(data['forum']['ID']).upper()).update(data['forum'])
    new_web_page_data = data['webPageList']
    if len (new_web_page_data)==0:
        db.query(models.WebPage).filter(models.WebPage.ForumID == str(data['forum']['ID']).upper()).update({
            "Enable": False
        })
    else:           
        web_page_data=db.query(models.WebPage).filter(models.WebPage.ForumID == str(data['forum']['ID'])).all()
        # 判斷新增
        # 判斷修改
        # 判斷刪除


    db.commit()
    return {"message": "修改成功"}
