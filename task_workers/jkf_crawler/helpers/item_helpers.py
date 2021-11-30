from datetime import datetime
import logging
import re
from helpers.error_log_helper import format_error_msg
import uuid
from bs4 import BeautifulSoup
import httpx

pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
logging.basicConfig(level=logging.INFO)


async def download_jkf(data):
    try:
        client = httpx.Client(timeout=None ,transport=httpx.HTTPTransport(retries=500))  # , transport=httpx.HTTPTransport(retries=500)
        root_page_url = data['root_page_url']
        i = data['i']
        id = data['id']
        url = f"{root_page_url}-{i}.html"
        res =  client.get(url)
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
            images=''
            try:
                image_html = client.get(image_url)
                image_root = BeautifulSoup(image_html.text, "html.parser")
                images = image_root.find_all('ignore_js_op')
            except Exception as e:
                logging.error(e)
                pass
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
            request_data = {"Images": db_images_array, "Item": add_data}
            response =  client.post(
                f'{pubsub_url}/process-jkf?metadata.ttlInSeconds=120', json=request_data) 
            logging.info(response.status_code)
        return data
    except Exception as e:
        logging.error('---------------ERROR START---------------------')
        logging.error(data)
        error_msg = format_error_msg(e)
        logging.error(error_msg)
        logging.error('---------------ERROR END---------------------')
        return error_msg
        
