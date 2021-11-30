from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from helpers import item_helpers
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
        item_helpers.download_mdk,request_data['data'])
    message="OK"
    return {"message":message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== mdk Crawler start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8791, debug=True, reload=True)
