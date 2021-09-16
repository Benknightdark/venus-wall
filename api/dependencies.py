import os
from fastapi import Request
from pymongo import MongoClient
flower_api_url = os.environ.get("FLOWER_API_URL")
mongo_db_connect_string = os.environ.get("MONGO_DB_CONNECT_STRING")
def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()


def get_mongo_db(request: Request):
    '''
    取得爬蟲執行結果
    '''
    try:
        db = MongoClient(mongo_db_connect_string)
        yield db
    finally:
        db.close()


def send_task(request: Request):
    '''
    執行爬蟲工作
    '''    
    yield f"{flower_api_url}/api/task/send-task"
# send-task


def task_info(request: Request):
    '''
    取得特定的爬蟲任務資訊
    '''
    yield f"{flower_api_url}/api/task/info"


def all_task_info(request: Request):
    '''
    取得所有的爬蟲任務資訊
    '''
    yield f"{flower_api_url}/api/tasks"


def task_abort(request: Request):
    '''
    強制停止正在執行工作的爬蟲
    '''
    yield f"{flower_api_url}/api/task/abort"
