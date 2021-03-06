# from models.models import Forum,WebPage
from . import models
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime, time, timedelta


class BaseConfigModel(BaseModel):
    class Config:
        orm_mode = True


class WebPageCreate(BaseConfigModel):
    Name: str
    Url: str
    ForumID: str


class ItemCreate(BaseConfigModel):
    Title: str
    Url: str
    Avator: str
    PageName: str
    ModifiedDateTime: str

# class ForumCreate(BaseModel):
#     forum:Optional[models.Forum]
#     forumWebPageData:Optional[List[models.WebPage]]
