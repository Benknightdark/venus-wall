from pydantic import BaseModel
from typing import List, Optional

class BaseConfigModel(BaseModel):
    class Config:
        orm_mode = True
class WebPageCreate(BaseConfigModel):
    Name: str
    Url: str


class ItemCreate(BaseConfigModel):
    Title: str
    Url: str
    Avator: str