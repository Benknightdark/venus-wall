import httpx
from pymongo import mongo_client
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import NVARCHAR
from dependencies import get_db, send_task, task_info, all_task_info, get_mongo_db
from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models, view_models
from bson import json_util
import json
router = APIRouter()


@router.get("/task/{id}", summary="取得此task id的爬蟲最新工作狀態")
async def get_item_by_web_page_id(id: str,
                                  flower_task_info: str = Depends(task_info)):
    transport = httpx.HTTPTransport(retries=5)
    client = httpx.Client(transport=transport)
    req = client.get(f'{flower_task_info}/{id}')
    res = req.json()
    return res


@router.get("/tasks", summary="取得所有爬蟲任務資訊")
async def get_item_by_web_page_id(
        flower_all_task_info: str = Depends(all_task_info)):
    transport = httpx.HTTPTransport(retries=5)
    client = httpx.Client(transport=transport)
    req = client.get(f'{flower_all_task_info}')
    res = req.json()
    return res


@router.get("/task/results/{id}", summary="取得特定webpage id的所有爬蟲執行結果")
async def get_item_by_web_page_id(id: str,
                                  db: Session = Depends(get_db),
                                  mongo_db: mongo_client = Depends(get_mongo_db)):
    web_task_data = db.query(func.lower(models.WebPageTask.TaskID.cast(NVARCHAR(None))).label('_id')).filter(
        models.WebPageTask.WebPageID == id).all()
    web_task_data_dict = [w._asdict() for w in web_task_data]
    celery_result_db = mongo_db['celery']
    print({"$or": web_task_data_dict})
    data = celery_result_db['celery_taskmeta'].find({"$or": web_task_data_dict},{ "_id": 1, "status": 1, "date_done": 1}
        ).sort("date_done", -1)
    return json.loads(json_util.dumps(data))

    # json.loads(json_util.dumps(data))
