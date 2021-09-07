from celery import Celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)
app = Celery('tasks', broker='redis://:YORPAS99RDDaabvxvc3@localhost:6398/0',backend='redis://:YORPAS99RDDaabvxvc3@localhost:6398/1')
app.conf.update(
     enable_utc=True,
     timezone='Asia/Taipei',
     task_serializer='json',
)
app.conf.CELERY_WORKER_SEND_TASK_EVENTS = True

app.conf.result_backend_transport_options = {
    'retry_policy': {
       'timeout': 5.0
    }
}
@app.task
def add(x, y):
    logger.info('Adding {0} + {1}'.format(x, y))
    return x + y
@app.task
def error_handler(request, exc, traceback):
    logger.error('Task {0} raised exception: {1!r}\n{2!r}'.format(
          request.id, exc, traceback))    
if __name__ == "__main__":
    app.start()          