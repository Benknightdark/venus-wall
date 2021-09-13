import httpx
from dependencies import get_db, send_task,task_info,all_task_info
from fastapi.params import Depends
from fastapi import APIRouter

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

@router.get("/tasks/results/{id}", summary="取得特定webpage id的所有爬蟲執行結果")
async def get_item_by_web_page_id(
                                  flower_all_task_info: str = Depends(all_task_info)):
    transport = httpx.HTTPTransport(retries=5)
    client = httpx.Client(transport=transport)                              
    req = client.get(f'{flower_all_task_info}')
    res = req.json()
    return res 