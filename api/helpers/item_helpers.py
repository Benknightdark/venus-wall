from datetime import datetime
import logging
import re
import uuid
from bs4 import BeautifulSoup
import httpx
from models.models import WebPage
from typing import Optional
from sqlalchemy.orm.session import Session
from models import models
     
class ItemHandler:
    '''
    執行更新或修改Item Data
    '''
    def __init__(self,start:Optional[str],end:Optional[str]):
        self.start = start
        self.end=end
    def update_item(self,web_page:WebPage,db:Session):
        if web_page.WebPageForumID_U.Name=='JKF':
            res = httpx.get(web_page.Url)
            get_all_page=self.end
            if get_all_page==None:
                get_all_page = BeautifulSoup(res.text, "html.parser").find('input', attrs={
                'name': 'custompage'}).next_element['title'].replace('共', '').replace('頁', '').replace(' ', '')
            else:
                 get_all_page=int(self.end)   
            logging.info(get_all_page)
            web_page_url = web_page.Url.replace('-1.html', '')
            root_page_url = web_page_url
            i=self.start
            if i==None:
                i: int = 1
            else:
                i=int(self.start)    
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
                                "Page":i,
                                "Url": image_url,
                                "Avator": avator,
                                "ModifiedDateTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            })
                    else:
                        logging.info('insert')
                        db.add(models.Item(ID=item_id, Title=image_name,
                            PageName=w.a['href'], Url=image_url, WebPageID=id,Page=i, Avator=avator,
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
class WebPageFilter:
    '''
    取得WebPage Data
    '''
    def __init__(self, id):
        self.id = id

    def get_by_id(self,db: Session):
        return db.query(models.WebPage).filter(
            models.WebPage.ID == self.id).first()
class ItemHelper:
    '''
    執行Item Table的資料處理
    '''
    def __init__(self,db:Session,f:WebPageFilter,h:ItemHandler):
        self.db = db
        self.f=f
        self.h=h 
    def process(self) :
        data=self.f.get_by_id(self.db)
        self.h.update_item(data,self.db)