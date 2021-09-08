
import os

from celery import Celery
import os
import time
from datetime import datetime

os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')

app = Celery('tasks')
app.config_from_envvar('CELERY_CONFIG_MODULE')


@app.task
def add(x, y):
    print(x+y)
    return x + y
@app.task
def echo():
    return 'hi'

if __name__ == "__main__":
    app.start()
