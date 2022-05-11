from datetime import datetime
import logging
from bs4 import BeautifulSoup
import httpx
from dapr_httpx.error_log_helper import format_error_msg
from dapr_httpx.pubsub_api import PubSubApi
logging.basicConfig(level=logging.INFO)



async def get_jkf_url(web_page):
    pub_sub=PubSubApi(end_point_name='pubsub')
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
            payload = {"root_page_url": root_page_url, "i": i, "id": id}
            message_res=await pub_sub.publish('jkf_crawl?metadata.ttlInSeconds=12000',payload=payload)
            logging.info(message_res)
            logging.info(payload)
            i = i+1
        web_page_name = web_page["Name"]
        finished_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return_data = {"status": f"{web_page_name} - {finished_time}"}
        return return_data
    except Exception as e:
        logging.error('----------------------------------------------')
        error_msg = format_error_msg(e)
        logging.error(error_msg)
        return error_msg


