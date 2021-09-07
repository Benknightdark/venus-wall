
import os

from celery import Celery
import os
import time
from datetime import datetime

os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')

app = Celery('tasks')
app.config_from_envvar('CELERY_CONFIG_MODULE')
# app.conf.CELERY_WORKER_SEND_TASK_EVENTS = True


@app.task
def add(x, y):
    print(x+y)
    return x + y
@app.task
def echo():
    return 'hi'

# @app.task
# def sleep(seconds):
#     time.sleep(seconds)


# @app.task
# def echo(msg, timestamp=False):
#     return "%s: %s" % (datetime.now(), msg) if timestamp else msg


# @app.task
# def error(msg):
#     raise Exception(msg)


if __name__ == "__main__":
    app.start()
