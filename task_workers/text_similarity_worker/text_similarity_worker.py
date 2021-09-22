
import os
from celery import Celery
from helpers.item_helpers import ItemHandler, ItemHelper, WebPageFilter
from models import base
from models import models, base
from dotenv import load_dotenv
load_dotenv()
os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')
models.base.Base.metadata.create_all(bind=base.engine)
app = Celery('text_similarity_worker')
app.config_from_envvar('CELERY_CONFIG_MODULE')


@app.task(autoretry_for=(Exception,),     max_retries=20,
          retry_backoff=True,
          retry_backoff_max=60)
def update_web_page_similarity(id):
    with base.SessionLocal() as session:
        session.begin()
        session.execute('set transaction isolation level serializable')
        session.close()
        return process_status


if __name__ == "__main__":
    app.start()
