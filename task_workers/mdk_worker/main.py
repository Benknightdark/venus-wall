from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from helpers import item_helpers
from fastapi.params import Depends
from dapr_httpx.pubsub_api import PubSubApi
from dependencies import pubsub_service
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'mdk_worker', 'route': '/mdk_worker'},
    ]
    return (subscriptions)





@app.post("/mdk_worker")
async def send_notification(request: Request, background_tasks: BackgroundTasks, pub_sub: PubSubApi = Depends(pubsub_service)):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.get_mdk_url,request_data['data'])
    message="OK"
    res = await pub_sub.publish('process-log', payload=request_data)
    logging.info(res)
    return {"message":message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== mdk Worker start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8790,  reload=True)
