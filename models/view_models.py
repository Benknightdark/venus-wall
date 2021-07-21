from pydantic import BaseModel
from typing import List, Optional

class WebPageCreate(BaseModel):
    Name:str
    Url:str
    class Config:
        orm_mode = True