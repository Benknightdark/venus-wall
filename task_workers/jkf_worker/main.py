from fastapi import BackgroundTasks, FastAPI, Request
import logging
from helpers import item_helpers
import httpx
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'

app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    logging.info('subscribe==================================')
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_worker', 'route': '/jkf_worker'},
    ]
    return (subscriptions)


@app.post("/jkf_worker")
async def jkf_worker(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.get_jkf_url, request_data['data'])
    message = "OK"
    res=httpx.post(f'{pubsub_url}/process-log',json=request_data)
    logging.info(res.status_code)
    return {"message": message}



if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Worker startv ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8789, debug=True, reload=True)
