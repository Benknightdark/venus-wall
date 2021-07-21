from typing import List
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session, joinedload, lazyload, selectinload
from models import models, base, view_models
import uuid
models.base.Base.metadata.create_all(bind=base.engine)

app = FastAPI()


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = base.SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()


@app.post("/api/webpage",description="新增網頁類別")
async def add_web_apge(data: List[view_models.WebPageCreate], db: Session = Depends(get_db)):
    db_item_array = []
    for d in data:
        db_item_array.append(models.WebPage(**d.dict(), ID=str(uuid.uuid4())))
    db.add_all(db_item_array)
    db.commit()
    for d in db_item_array:
        db.refresh(d)
    return db_item_array


@app.get("/api/webpage",description="取得要抓的所有網頁類別")
async def get_web_page(db: Session = Depends(get_db)):
    data = db.query(models.WebPage).all()
    return data

@app.get("/api/webpage/{id}",description="透過id，取得要抓的網頁類別")
async def get_web_page_by_id(id:str,db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID==id).first()
    return data