import logging
import re
from typing import List
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session, joinedload, lazyload, selectinload
from models import models, base, view_models
import uuid
from bs4 import BeautifulSoup
import httpx
logging.basicConfig(level=logging.INFO)

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


@app.post("/api/webpage", description="新增網頁類別")
async def add_web_apge(data: List[view_models.WebPageCreate], db: Session = Depends(get_db)):
    db_item_array = []
    for d in data:
        db_item_array.append(models.WebPage(**d.dict(), ID=str(uuid.uuid4())))
    db.add_all(db_item_array)
    db.commit()
    for d in db_item_array:
        db.refresh(d)
    return db_item_array


@app.get("/api/webpage", description="取得要抓的所有網頁類別")
async def get_web_page(db: Session = Depends(get_db)):
    data = db.query(models.WebPage).all()
    return data


@app.get("/api/webpage/{id}", description="透過id，取得要抓的網頁類別")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).first()
    return data


@app.delete("/api/webpage/{id}", description="透過id，刪除網頁類別")
async def get_web_page_by_id(id: str, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(models.WebPage.ID == id).delete()
    db.commit()
    return data


@app.put("/api/webpage/{id}", description="透過id，修改網頁類別")
async def get_web_page_by_id(id: str, data: view_models.WebPageCreate, db: Session = Depends(get_db)):
    data = db.query(models.WebPage).filter(
        models.WebPage.ID == id).update(data.dict())
    return data


@app.get("/api/item/{id}", description="透過id，取得要抓的網頁類別的子網頁")
async def get_item_by_web_page_id(id: str, db: Session = Depends(get_db)):
    web_page = db.query(models.WebPage).filter(
        models.WebPage.ID == id).first()
    html = httpx.get(web_page.Url).text
    root = BeautifulSoup(html, "html.parser")
    water_fall = root.find('ul', id='waterfall').find_all(
        'div', attrs={'class': 'c cl'})
    logging.info(f'{len(water_fall)}')
    for w in water_fall:
        image_name = re.sub('[^\w\-_\. ]', '_', w.a['title'])
        image_url = 'https://www.jkforum.net/'+w.a['href']
        logging.info(image_name)
        logging.info(image_url)
        logging.info('-------------------------')
    return html
