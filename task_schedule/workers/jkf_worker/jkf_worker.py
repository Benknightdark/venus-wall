
import os
from celery import Celery
from helpers.item_helpers import ItemHandler, ItemHelper, WebPageFilter
from models import base
from models import models, base
os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')
models.base.Base.metadata.create_all(bind=base.engine)

app = Celery('jkf_worker')
app.config_from_envvar('CELERY_CONFIG_MODULE')


@app.task(autoretry_for=(Exception,),     max_retries=20,
          retry_backoff=True,
          retry_backoff_max=700)
def update_item(id, start, end):
    with base.SessionLocal() as session:
        session.begin()
        session.execute('set transaction isolation level serializable')
        h = ItemHandler(start, end)
        f = WebPageFilter(id)
        helper = ItemHelper(session, f, h)
        process_status = helper.process()
        session.close()
        return process_status


if __name__ == "__main__":
    app.start()
