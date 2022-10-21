from dapr_httpx.pubsub_api import PubSubApi
from dapr_httpx.state_api import StateApi
from fastapi import BackgroundTasks, FastAPI, Request
import logging
from fastapi.params import Depends
from helpers import item_helpers
from dependencies import pubsub_service,state_service

app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    logging.info('subscribe==================================')
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_worker', 'route': '/jkf_worker'},
    ]
    return (subscriptions)


@app.post("/jkf_worker")
async def jkf_worker(request: Request, background_tasks: BackgroundTasks, pub_sub: PubSubApi = Depends(pubsub_service)
, state: StateApi = Depends(state_service)
):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.get_jkf_url, request_data['data'])
    message = "OK"
    res = await pub_sub.publish('process-log', payload=request_data)
    logging.info(res)
    return {"message": message}


if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Worker startv ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8789,  reload=True)
