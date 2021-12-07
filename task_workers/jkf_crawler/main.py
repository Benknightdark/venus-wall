from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from fastapi.params import Depends
from helpers import item_helpers
from dapr_httpx.pubsub_api import PubSubApi
from dependencies import pubsub_service

app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    logging.info('subscribe==================================')
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_crawl', 'route': '/jkf_crawl'},
    ]
    return (subscriptions)


@app.post("/jkf_crawl")
async def jkf_crawl(request: Request, background_tasks: BackgroundTasks, pub_sub: PubSubApi = Depends(pubsub_service)):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.download_jkf, request_data['data'])
    message = "OK"
    res = pub_sub.publish('process-log', payload=request_data)
    logging.info(res)
    return {"message": message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Crawler ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8800, debug=True, reload=True)
