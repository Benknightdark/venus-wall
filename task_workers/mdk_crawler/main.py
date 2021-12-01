from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
import httpx
from helpers import item_helpers
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'mdk_crawl', 'route': '/mdk_crawl'},
    ]
    return (subscriptions)


@app.post("/mdk_crawl")
async def mdk_crawl(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.download_mdk, request_data['data'])
    message = "OK"
    res = httpx.post(f'{pubsub_url}/process-log', json=request_data)
    logging.info(res.status_code)
    return {"message": message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== mdk Crawler start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8791, debug=True, reload=True)
