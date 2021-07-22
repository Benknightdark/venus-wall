import logging
import re
from typing import List
from fastapi import Depends, FastAPI, HTTPException, Request, Response, BackgroundTasks
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


def get_items(id: str, db: Session):
    web_page = db.query(models.WebPage).filter(
        models.WebPage.ID == id).first()
    web_page_url = web_page.Url.replace('-1.html', '')
    root_page_url=web_page_url
    i: int = 1
    run = True
    while run:
        logging.info(f'{i}') 
        url = f"{root_page_url}-{i}.html"
        res = httpx.get(url)
        html = res.text
        root = BeautifulSoup(html, "html.parser")
        water_fall_root=root.find('ul', id='waterfall')
        logging.info(web_page_url)
        if len(water_fall_root) == 0:
            run = False
            break
        water_fall = water_fall_root.find_all(
            'div', attrs={'class': 'c cl'})
        logging.info(f'{len(water_fall)}')

        for w in water_fall:
            image_name = re.sub('[^\w\-_\. ]', '_', w.a['title'])
            image_url = 'https://www.jkforum.net/'+w.a['href']
            logging.info(image_name)
            logging.info(image_url)
            image_html = httpx.get(image_url).text
            image_root = BeautifulSoup(image_html, "html.parser")
            images = image_root.find_all('ignore_js_op')
            for image in images:
                try:
                    logging.info(f"  {image.img['file']}")
                except:
                    pass
            logging.info('-------------------------')
        i=i+1 
          


@app.get("/api/item/{id}", description="透過id，取得要抓的網頁類別的子網頁")
async def get_item_by_web_page_id(id: str, background_tasks: BackgroundTasks,
                                  db: Session = Depends(get_db)):
    background_tasks.add_task(get_items, id, db)
    return {"message": "Notification sent in the background"}
