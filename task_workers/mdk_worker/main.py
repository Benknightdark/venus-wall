from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from helpers import item_helpers
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'mdk_worker', 'route': '/mdk_worker'},
    ]
    return (subscriptions)





@app.post("/mdk_worker")
async def send_notification(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.update_mdk_item,request_data['data'])
    message="OK"
    return {"message":message}

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== mdk Crawler start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8790, debug=True, reload=True)
