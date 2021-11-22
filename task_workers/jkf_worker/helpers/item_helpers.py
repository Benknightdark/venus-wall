from datetime import datetime
import logging
import re
from helpers.error_log_helper import format_error_msg
import uuid
from bs4 import BeautifulSoup
import httpx
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
logging.basicConfig(level=logging.INFO)





def get_jkf_url(web_page):
    try:
        page_seq = 1
        id = web_page["ID"]
        res = httpx.get(web_page["Url"])
        get_all_page = web_page["End"]
        # 設定停止頁數
        if get_all_page == "0":
            get_all_page = BeautifulSoup(res.text, "html.parser").find('input', attrs={
                'name': 'custompage'}).next_element['title'].replace('共', '').replace('頁', '').replace(' ', '')
        else:
            get_all_page = int(web_page["End"])
        logging.info(get_all_page)
        web_page_url = web_page["Url"].replace('-1.html', '')
        root_page_url = web_page_url
        # 設定開始頁數
        i = web_page["Start"]
        if i == "0":
            i: int = 1
        else:
            i = int(web_page["Start"])
        # 執行爬蟲
        while i <= int(get_all_page):
            cc={"root_page_url":root_page_url,"i":i}
            httpx.post(f'{pubsub_url}/jkf_crawl',json={"root_page_url":root_page_url,"i":i,"id":id})
            i = i+1
        web_page_name = web_page["Name"]
        finished_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return_data = {"status": f"{web_page_name} - {finished_time}"}
        return return_data
    except Exception as e:
        logging.error('----------------------------------------------')
        error_msg = format_error_msg(e)
        logging.error(error_msg)

async def download_jkf(data):
    client = httpx.AsyncClient()
    root_page_url = data['root_page_url']
    i = data['i']
    id = data['id']
    url = f"{root_page_url}-{i}.html"
    res =await  client.get(url)
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
        item_id = str(uuid.uuid4())
        page_name = w.a['href']
        add_data = {
            "ID": item_id, "Title": str(image_name), "Page": i,
            "Enable": True,
            "Seq": page_seq,
            "PageName": str(page_name), "Url": str(image_url), "WebPageID": str(id), "Avator": str(avator),
            "ModifiedDateTime": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        image_html = (await client.get(image_url)).text
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
                image_id = str(uuid.uuid4())
                db_images_array.append(
                    {
                        "ID": image_id,
                        "Url": str(image_url),
                        "ItemID": item_id
                    })

                logging.info(f"  {image_url}")
            except:
                pass
        logging.info('-------------------------')

        try:
            response =await  client.post(
                f'{pubsub_url}/process-jkf', json={"Images": db_images_array, "Item": add_data})  # , ,"Item": add_data
            response.raise_for_status()
        except Exception as e:
            logging.error(e)
        # finally:
        #     await client.aclose()