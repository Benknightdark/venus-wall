from datetime import datetime
import logging
import re
from helpers.error_log_helper import format_error_msg
import uuid
from bs4 import BeautifulSoup
import httpx
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
logging.basicConfig(level=logging.INFO)


def download_mdk(data):
    client = httpx.AsyncClient(
        timeout=None)
    url=data["url"]
    i=data["i"]
    id=data["id"]
    url = f"{url}&filter=&orderby=lastpost&page={i}"
    res = client.get(url, verify=False)
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
            logging.info('----------------------')
            item_id = str(uuid.uuid4())

            add_data = {
                "ID": item_id, "Title": title, "Page": i, "Enable": True, "Seq": int(seq),
                "PageName": page_name, "Url": link, "WebPageID": id, "Avator": avator,
                                       "ModifiedDateTime": modfied_date_time
            }
            content_res = client.get(
                f"https://www.mdkforum.com/{href['href']}", verify=False)
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
                    db_images_array.append(
                        {
                            "ID": str(uuid.uuid4()),
                            "Url": f"https://www.mdkforum.com/{image_url}",
                            "ItemID": item_id
                        })
                except:
                    pass
            logging.info('-------------------------')
            req = client.post(f"{pubsub_url}/process-mdk?metadata.ttlInSeconds=1200", json={
                "Item": add_data, "Images": db_images_array})
            res = req.text
            logging.info(res)
            logging.info('-------------------------')