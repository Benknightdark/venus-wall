from datetime import datetime
import logging
from dapr_httpx.error_log_helper import format_error_msg
from bs4 import BeautifulSoup
import httpx
from dapr_httpx.pubsub_api import PubSubApi
logging.basicConfig(level=logging.INFO)


async def get_mdk_url(web_page):
    pub_sub=PubSubApi(end_point_name='pubsub')
    try:
        client = httpx.AsyncClient(timeout=None)
        id = web_page["ID"]
        url = web_page["Url"]
        res = await client.get(url)#, verify=False
        root = BeautifulSoup(res.text, "html.parser")
        get_all_page = web_page["End"]
        if get_all_page == "0":
            get_all_page = int(root.find('a', attrs={'class': 'last'}).text.replace(
                '.', '').replace(' ', ''))
        else:
            get_all_page = int(web_page["End"])
        logging.info(get_all_page)
        i = web_page["Start"]
        if i == "0":
            i: int = 1
        else:
            i = int(web_page["Start"])
        while i <= int(get_all_page):
            logging.info(f'{i}')
            payload = {"root_page_url": url, "i": i, "id": id}
            message_res=await pub_sub.publish('mdk_crawl?metadata.ttlInSeconds=1200',payload=payload)
            logging.info(message_res)
            i = i+1

        web_page_name = web_page["Name"]
        finished_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return_data = {"status": f"{web_page_name} - {finished_time}"}
        return return_data
    except Exception as e:
        logging.error('----------------------------------------------')
        error_msg = format_error_msg(e)
        return(error_msg)
