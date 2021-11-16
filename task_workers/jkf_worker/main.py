from fastapi import BackgroundTasks, FastAPI, Request
import logging
import logging
from helpers import item_helpers
pubsub_url = 'http://localhost:3500/v1.0/publish/pubsub'
app = FastAPI()


@app.get('/dapr/subscribe')
def subscribe():
    subscriptions = [
        {'pubsubname': 'pubsub', 'topic': 'jkf_worker', 'route': '/jkf_worker'},
    ]
    return (subscriptions)





@app.post("/jkf_worker")
async def send_notification(request: Request, background_tasks: BackgroundTasks):
    request_data = await request.json()
    logging.info(request_data)
    background_tasks.add_task(
        item_helpers.update_jkf_item(request_data['data']))
    return request_data

if __name__ == '__main__':
    import uvicorn
    logging.info("🔧😎😎🤖🤖🤖==== jkf Crawler start ===🤖🤖🤖😎😎🔧")
    uvicorn.run("main:app", port=8789, debug=True, reload=True)
