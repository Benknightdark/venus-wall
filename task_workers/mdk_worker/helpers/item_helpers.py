from datetime import datetime
import logging
import re

from sqlalchemy.orm import session
from helpers.error_log_helper import format_error_msg
import uuid
from bs4 import BeautifulSoup
import httpx
from models.models import WebPage
from typing import Optional
from sqlalchemy.orm.session import Session
from models import models
logging.basicConfig(level=logging.INFO)


class ItemHandler:
    '''
    執行更新或修改Item Data
    '''

    def __init__(self, start: Optional[str], end: Optional[str]):
        self.start = start
        self.end = end

    def update_mdk_item(self, web_page: WebPage, db: Session):
        try:
            id = web_page.ID
            url = f'{web_page.Url}'
            res = httpx.get(url,verify=False)
            root = BeautifulSoup(res.text, "html.parser")
            get_all_page = self.end
            if get_all_page == "0":
                get_all_page = int(root.find('a', attrs={'class': 'last'}).text.replace(
                    '.', '').replace(' ', ''))
            else:
                get_all_page = int(self.end)
            logging.info(get_all_page)
            i = self.start
            if i == "0":
                i: int = 1
            else:
                i = int(self.start)
            while i <= int(get_all_page):
                logging.info(f'{i}')
                url = f"{web_page.Url}&filter=&orderby=lastpost&page={i}"
                res = httpx.get(url,verify=False)
                logging.info(url)
                root = BeautifulSoup(res.text, "html.parser")
                lists = root.find_all(
                    'div', attrs={'class': 'nex_waterfallbox'})
                if lists == []:
                    lists = root.find_all(
                        'th', attrs={'class': 'new forumtit'})
                if len(lists) > 0:
                    for l in lists:
                        href = l.find('a')
                        try:
                            title = href['title']
                        except:
                            title = href.text
                        page_name = href['href']
                        seq = page_name.split('&')[1].replace('tid=', '')
                        link = f"https://www.mdkforum.com/{href['href']}"
                        avator = ''
                        try:
                            avator = f"https://www.mdkforum.com/{href.img['src']}"
                        except:
                            forumlist_pics = l.find(
                                'div', attrs={'class': 'nex_forumlist_pics'}).find('a')
                            logging.info(forumlist_pics)
                            if forumlist_pics != None:
                                avator = f"https://www.mdkforum.com/{forumlist_pics.img['src']}"
                        modfied_date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        logging.info(
                            f"{title} ==== {i} - {get_all_page}")
                        logging.info('----------------------')
                        selected_item = db.query(models.Item).filter(
                            models.Item.PageName == page_name)
                        item_id = uuid.uuid4()
                        if selected_item.count() == 1:
                            item_id = selected_item.first().ID
                            db.query(models.Image).filter(models.Image.ItemID ==
                                                          selected_item.first().ID).delete()
                            selected_item.update(
                                {
                                    "Title": title,
                                    "PageName": page_name,
                                    "Page": i,
                                    "Seq": int(seq),
                                    "Url": link,
                                    "Avator": avator,
                                    "Enable": True,
                                    "ModifiedDateTime": modfied_date_time
                                })
                        else:
                            logging.info('insert')
                            add_data = models.Item(ID=item_id, Title=title, Page=i, Enable=True, Seq=int(seq),
                                                   PageName=page_name, Url=link, WebPageID=id, Avator=avator,
                                                   ModifiedDateTime=modfied_date_time)
                            db.add(add_data)
                        content_res = httpx.get(
                            f"https://www.mdkforum.com/{href['href']}",verify=False)
                        root_content = BeautifulSoup(
                            content_res.text, "html.parser")
                        content_image = root_content.find_all('ignore_js_op')
                        db_images_array = []
                        for c in content_image:
                            try:
                                logging.info(
                                    c.find('img', attrs={'class': 'zoom'})['file'])
                                image_url = c.find(
                                    'img', attrs={'class': 'zoom'})['file']
                                db_images_array.append(models.Image(
                                    ID=uuid.uuid4(), Url=f"https://www.mdkforum.com/{image_url}", ItemID=item_id))
                            except:
                                pass
                        if len(db_images_array) > 1:
                            db.add_all(db_images_array)
                        db.commit()
                        logging.info('-------------------------')

                i = i+1
            return {"status": f"{web_page.Name} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"}
        except Exception as e:
            logging.error('----------------------------------------------')
            error_msg = format_error_msg(e)
            raise(error_msg)


class WebPageFilter:
    '''
    取得WebPage Data
    '''

    def __init__(self, id):
        self.id = id

    def get_by_id(self, db: Session):
        return db.query(models.WebPage).filter(
            models.WebPage.ID == self.id).first()


class ItemHelper:
    '''
    執行Item Table的資料處理
    '''

    def __init__(self, db: Session, f: WebPageFilter, h: ItemHandler):
        self.db = db
        self.f = f
        self.h = h

    def process(self):
        data = self.f.get_by_id(self.db)
        return self.h.update_mdk_item(data, self.db)
