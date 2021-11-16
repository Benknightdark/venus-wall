from fastapi import BackgroundTasks, FastAPI, Request
import httpx
import logging
from bs4 import BeautifulSoup
from datetime import datetime
import urllib.parse
import json
import logging
from helpers import item_helpers
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'crawl-jkf', 'route': '/crawl-jkf'},
    ]
    return (subscriptions)





@app.post("/crawl-jkf")
async def send_notification(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    # web_page={id:1,url:'',start,end}
    background_tasks.add_task(
        item_helpers.update_jkf_item(request_data['data']))
    return {"message": request_data['data']}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Crawler start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8789, debug=True, reload=True)
