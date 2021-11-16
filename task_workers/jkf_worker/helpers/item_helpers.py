from datetime import datetime
import logging
import re
from helpers.error_log_helper import format_error_msg
import uuid
from bs4 import BeautifulSoup
import httpx
logging.basicConfig(level=logging.INFO)


def update_jkf_item(web_page):
    try:
        # web_page={id:1,url:'',start,end}
        page_seq = 1
        id = web_page["ID"]
        res = httpx.get(web_page["Url"])
        get_all_page = web_page["end"]

        # 設定停止頁數
        if get_all_page == "0":
            get_all_page = BeautifulSoup(res.text, "html.parser").find('input', attrs={
                'name': 'custompage'}).next_element['title'].replace('共', '').replace('頁', '').replace(' ', '')
        else:
            get_all_page = int(web_page["end"])
        logging.info(get_all_page)
        web_page_url = web_page["Url"].replace('-1.html', '')
        root_page_url = web_page_url
        # 設定開始頁數
        i = web_page["start"]
        if i == "0":
            i: int = 1
        else:
            i = int(web_page["start"])
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
                item_id = uuid.uuid4()
                add_data = {
                    "ID": item_id, "Title": image_name, "Page": i,
                    "Enable": True,
                    "Seq": page_seq,
                    "PageName": w.a['href'], "Url": image_url, "WebPageID": id, "Avator": avator,
                    "ModifiedDateTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
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

                        db_images_array.append(
                            {
                                "ID": uuid.uuid4(), "Url": image_url, "ItemID": item_id
                            })

                        logging.info(f"  {image_url}")
                    except:
                        pass
                logging.info('-------------------------')
            i = i+1
        web_page_name = web_page["Name"]
        return {"status": f"{web_page_name} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"}
    except Exception as e:
        logging.error('----------------------------------------------')
        error_msg = format_error_msg(e)
        logging.error(error_msg)
        raise(error_msg)
