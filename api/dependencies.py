import os
from fastapi import Request
flower_api_url = os.environ("FLOWER_API_URL", "http://localhost:8888")


def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()


def apply_async(request: Request):
    yield f"{flower_api_url}/api/task/apply-async"


def task_info(request: Request):
    yield f"{flower_api_url}/api/task/info"


def task_abort(request: Request):
    yield f"{flower_api_url}/api/task/abort"
