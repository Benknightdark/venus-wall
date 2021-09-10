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

    def update_jkf_item(self, web_page: WebPage, db: Session):
        try:
            page_seq = 1
            id = web_page.ID
            res = httpx.get(web_page.Url)
            get_all_page = self.end

            # 設定停止頁數
            if get_all_page == "0":
                get_all_page = BeautifulSoup(res.text, "html.parser").find('input', attrs={
                    'name': 'custompage'}).next_element['title'].replace('共', '').replace('頁', '').replace(' ', '')
            else:
                get_all_page = int(self.end)
            logging.info(get_all_page)
            web_page_url = web_page.Url.replace('-1.html', '')
            root_page_url = web_page_url
            # 設定開始頁數
            i = self.start
            if i == "0":
                i: int = 1
            else:
                i = int(self.start)
            # 執行爬蟲
            while i <= int(get_all_page):
                url = f"{root_page_url}-{i}.html"
                res = httpx.get(url)
                html = res.text
                root = BeautifulSoup(html, "html.parser")
                water_fall_root = root.find('ul', id='waterfall')
                logging.info(url)
                water_fall = water_fall_root.find_all(
                    'div', attrs={'class': 'c cl'})
                logging.info(f'{len(water_fall)}')

                for w in water_fall:
                    avator = ""
                    image_name = re.sub('[^\w\-_\. ]', '_', w.a['title'])
                    image_url = 'https://www.jkforum.net/'+w.a['href']
                    # 取出seq資料
                    try:
                        page_seq = w.a['href'].split('-')[1]
                    except:
                        page_seq = w.a['href'].split(
                            '&')[1].replace('tid=', '')
                        pass
                    # 取出avator資料
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
                                "Page": i,
                                "Seq": page_seq,
                                "Url": image_url,
                                "Avator": avator,
                                "Enable": True,
                                "ModifiedDateTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            })
                    else:
                        logging.info('insert')
                        add_data = models.Item(ID=item_id, Title=image_name, Page=i,
                                               Enable=True,
                                               Seq=page_seq,
                                               PageName=w.a['href'], Url=image_url, WebPageID=id, Avator=avator,
                                               ModifiedDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                        db.add(add_data)
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

                            logging.info(f"  {image_url}")
                        except:
                            pass
                    if len(db_images_array) > 1:
                        db.add_all(db_images_array)
                    # db.commit()
                    logging.info('-------------------------')
                i = i+1
            db.commit()

            return {"status": "success"}
        except Exception as e:
            logging.error('----------------------------------------------')
            error_msg = format_error_msg(e)
            logging.error(error_msg)
            raise(error_msg)
            # return {"status":"fail","reason":error_msg}
            #
        finally:
            db.close()

    def update_mdk_item(self, web_page: WebPage, db: Session):
        try:
            id = web_page.ID
            url = f'{web_page.Url}'
            res = httpx.get(url)
            root = BeautifulSoup(res.text, "html.parser")
            get_all_page = self.end
            if get_all_page == None:
                get_all_page = int(root.find('a', attrs={'class': 'last'}).text.replace(
                    '.', '').replace(' ', ''))
            else:
                get_all_page = int(self.end)
            logging.info(get_all_page)
            i = self.start
            if i == None:
                i: int = 1
            else:
                i = int(self.start)
            while i <= int(get_all_page):
                logging.info(f'{i}')
                url = f"{web_page.Url}&filter=&orderby=lastpost&page={i}"
                res = httpx.get(url)
                root = BeautifulSoup(res.text, "html.parser")
                lists = root.find_all(
                    'div', attrs={'class': 'nex_waterfallbox'})
                for l in lists:
                    href = l.find('a')
                    title = href['title']
                    page_name = href['href']
                    link = f"https://www.mdkforum.com/{href['href']}"
                    avator = ''
                    logging.info(href.img)
                    if href.img != None:
                        avator = f"https://www.mdkforum.com/{href.img['src']}"

                    modfied_date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    logging.info(f"{href['title']} ==== {i}")
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
                                "Url": link,
                                "Avator": avator,
                                "Enable": True,
                                "ModifiedDateTime": modfied_date_time
                            })
                    else:
                        logging.info('insert')
                        add_data = models.Item(ID=item_id, Title=title, Page=i, Enable=True,
                                               PageName=page_name, Url=link, WebPageID=id, Avator=avator,
                                               ModifiedDateTime=modfied_date_time)
                        db.add(add_data)
                    content_res = httpx.get(
                        f"https://www.mdkforum.com/{href['href']}")
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
            return {"status": "success"}
        except Exception as e:
            logging.error('----------------------------------------------')
            error_msg = format_error_msg(e)
            raise(error_msg)
            # return {"status":"fail","reason":error_msg}

    def update_item(self, web_page: WebPage, db: Session):
        if web_page.WebPageForumID_U.Name == 'JKF':
            return self.update_jkf_item(web_page, db)
        if web_page.WebPageForumID_U.Name == 'MDK':
            return self.update_mdk_item(web_page, db)
        return ""


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
        return self.h.update_item(data, self.db)
