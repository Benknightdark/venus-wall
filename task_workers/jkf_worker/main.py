from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from helpers import item_helpers
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_worker', 'route': '/jkf_worker'},
        {'pubsubname': 'pubsub', 'topic': 'jkf_crawl', 'route': '/jkf_crawl'},
    ]
    return (subscriptions)


@app.post("/jkf_worker")
async def jkf_worker(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.get_jkf_url, request_data['data'])
    message = "OK"
    return {"message": message}


@app.post("/jkf_crawl")
async def jkf_crawl(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.download_jkf, request_data['data'])
    message = "OK"
    return {"message": message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Worker start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8789, debug=True, reload=True)
