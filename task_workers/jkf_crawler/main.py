from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
import httpx
from helpers import item_helpers
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'

app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    logging.info('subscribe==================================')
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_crawl', 'route': '/jkf_crawl'},
    ]
    return (subscriptions)




@app.post("/jkf_crawl")
async def jkf_crawl(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.download_jkf, request_data['data'])
    message = "OK"
    res=httpx.post(f'{pubsub_url}/process-log',json=request_data)
    logging.info(res.status_code)
    return {"message": message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Crawler ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8800, debug=True, reload=True)
