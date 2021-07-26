from datetime import datetime
import logging
import re
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, Request, Response, BackgroundTasks
from sqlalchemy.orm import Session, joinedload, lazyload, selectinload
from sqlalchemy.sql.expression import desc
from sqlalchemy.sql.functions import mode
from sqlalchemy.sql.sqltypes import Integer
from models import models, base, view_models
import uuid
from bs4 import BeautifulSoup
import httpx
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
import sys
sys.setrecursionlimit(9000000) #這裡設定大一些
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


def update_items(id: str,start:int, db: Session):
    web_page = db.query(models.WebPage).filter(
        models.WebPage.ID == id).first()
    res = httpx.get(web_page.Url)
    get_all_page = BeautifulSoup(res.text, "html.parser").find('input', attrs={
        'name': 'custompage'}).next_element['title'].replace('共', '').replace('頁', '').replace(' ', '')
    logging.info(get_all_page)
    web_page_url = web_page.Url.replace('-1.html', '')
    root_page_url = web_page_url
    i: int = start
    while i <= int(get_all_page):
        logging.info(f'{i}')
        url = f"{root_page_url}-{i}.html"
        res = httpx.get(url)
        html = res.text
        root = BeautifulSoup(html, "html.parser")
        water_fall_root = root.find('ul', id='waterfall')
        logging.info(web_page_url)
        water_fall = water_fall_root.find_all(
            'div', attrs={'class': 'c cl'})
        logging.info(f'{len(water_fall)}')

        for w in water_fall:
            avator = ""
            image_name = re.sub('[^\w\-_\. ]', '_', w.a['title'])
            image_url = 'https://www.jkforum.net/'+w.a['href']
            try:
                if w.a.img == None:
                    avator = w.a['style'].split(
                        "url('")[1][:-3].split("');")[0]
                elif hasattr(w.a.img, 'src'):
                    avator = w.a.img['src']
            except:
                pass

            logging.info(f"{image_name} === {i}")
            logging.info(image_url)
            logging.info(avator)
            selected_item = db.query(models.Item).filter(
                models.Item.PageName == w.a['href'])
            item_id = uuid.uuid4()
            if selected_item.count() == 1:
                logging.info('update')
                item_id = selected_item.first().ID
                db.query(models.Image).filter(models.Image.ItemID ==
                                              selected_item.first().ID).delete()
                selected_item.update(
                    {
                        "Title": image_name,
                        "PageName": w.a['href'],
                        "Url": image_url,
                        "Avator": avator,
                        "ModifiedDateTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    })
            else:
                logging.info('insert')
                db.add(models.Item(ID=item_id, Title=image_name,
                       PageName=w.a['href'], Url=image_url, WebPageID=id, Avator=avator,
                       ModifiedDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            image_html = httpx.get(image_url).text
            image_root = BeautifulSoup(image_html, "html.parser")
            images = image_root.find_all('ignore_js_op')
            db_images_array = []
            for image in images:
                try:
                    image_url = ''
                    if hasattr(image.find('img', attrs={'class': 'zoom'}), 'file') == None:
                        image_url = image.find('img')['file']
                    else:
                        image_url = image.find(
                            'img', attrs={'class': 'zoom'})['file']

                    db_images_array.append(models.Image(
                        ID=uuid.uuid4(), Url=image_url, ItemID=item_id))
                    db.add_all(db_images_array)
                    logging.info(f"  {image_url}")
                except:
                    pass
            db.commit()
            logging.info('-------------------------')
        i = i+1


@app.post("/api/item/{id}", description="透過WebPage id，新增或修改此類別底下的item資料")
async def post_item_by_web_page_id(id: str,start:int, background_tasks: BackgroundTasks,
                                   db: Session = Depends(get_db)):
    background_tasks.add_task(update_items, id,start, db)
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
    a1=models.Users
    a2=models.Users
    data = db.query(a2.UserName,a1).join(a2)
    return data