import os
from fastapi import Request
flower_api_url = os.environ.get("FLOWER_API_URL", "http://localhost:8888")


def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()


def send_task(request: Request):
    yield f"{flower_api_url}/api/task/send-task"


def task_info(request: Request):
    yield f"{flower_api_url}/api/task/info"


def task_abort(request: Request):
    yield f"{flower_api_url}/api/task/abort"
