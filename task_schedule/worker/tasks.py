
import os

from sqlalchemy.engine import create_engine
from sqlalchemy.orm import session

from celery import Celery
import os
import time
from datetime import datetime
from sqlalchemy.orm.session import Session
from helpers.item_helpers import ItemHandler, ItemHelper, WebPageFilter
from models import base
from models import models, base

os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')
models.base.Base.metadata.create_all(bind=base.engine)

app = Celery('tasks')
app.config_from_envvar('CELERY_CONFIG_MODULE')


@app.task
def add(x, y):
    print(x+y)
    return x + y


@app.task
def echo():
    return 'hi'


@app.task
def update_item(id, start, end):    
    h = ItemHandler(start, end)
    f = WebPageFilter(id)
    session=base.SessionLocal()
    helper = ItemHelper(session, f, h)
    helper.process()
    return 'hi'


if __name__ == "__main__":
    app.start()