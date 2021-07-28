import logging
from typing import List, Optional
from fastapi import Depends, FastAPI, Request, Response, BackgroundTasks
from sqlalchemy.orm import Session, joinedload, lazyload, selectinload
from sqlalchemy.sql.expression import desc, select
from helpers.item_helpers import ItemHandler, WebPageFilter, ItemHelper
from models import models, base, view_models
import uuid
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
models.base.Base.metadata.create_all(bind=base.engine)
app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/api/webpage", description="新增WebPage ")
async def add_web_apge(data: List[view_models.WebPageCreate], db: Session = Depends(get_db)):
    db_item_array = []
    for d in data:
        db_item_array.append(models.WebPage(**d.dict(), ID=str(uuid.uuid4())))
    db.add_all(db_item_array)
    db.commit()
    for d in db_item_array:
        db.refresh(d)
    return db_item_array


@app.get("/api/webpage", description="取得要抓的所有WebPage ")
async def get_web_page(db: Session = Depends(get_db)):
    data = db.query(models.WebPage).all()
    return data


@app.get("/api/webpage/{id}", description="透過id，取得要抓的WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).first()
    return data


@app.delete("/api/webpage/{id}", description="透過id，刪除WebPage ")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).delete()
    db.commit()
    return data


@app.put("/api/webpage/{id}", description="透過id，修改WebPage ")
async def get_web_page_by_id(id: str, data: view_models.WebPageCreate, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(
        models.WebPage.ID == id).update(data.dict())
    return data


def update_items(id: str, start: Optional[str], end: Optional[str], db: Session):
    h = ItemHandler(start, end)
    f = WebPageFilter(id)
    helper = ItemHelper(db, f, h)
    helper.process()


@app.post("/api/item/{id}", description="透過WebPage id，新增或修改此類別底下的item資料")
async def post_item_by_web_page_id(background_tasks: BackgroundTasks, id: str, start: Optional[int] = None, end: Optional[int] = None, db: Session = Depends(get_db)):
    background_tasks.add_task(update_items, id, start, end, db)
    return {"message": "開始抓資料"}


@app.get("/api/item/{id}", description="透過WebPage id，取得要抓的item資料")
async def get_item_by_web_page_id(id: str, offset: int, limit: int,
                                  db: Session = Depends(get_db)):
    data = db.query(models.Item).filter(models.Item.WebPageID ==
                                        id).order_by((models.Item.ModifiedDateTime)).offset(offset*limit).limit(limit).all()
    return data


@app.get("/api/image/{id}", description="透過item id，取得要抓的image資料")
async def get_image_by_item_id(id: str,
                               db: Session = Depends(get_db)):
    data = db.query(models.Image).filter(models.Image.ItemID == id).all()
    return data


@app.get("/api/user")
async def get_image_by_item_id(db: Session = Depends(get_db)):
    a = models.Users
    data = db.query(models.Users)
    return (data.first())
