from itertools import groupby
from sqlalchemy.sql.expression import and_, desc, false, text
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter, Request
from sqlalchemy.orm import Session
from models import models, view_models
from datetime import datetime
import uuid
import json
router = APIRouter()

@router.get("/admin/forum-count", summary="取得論壇文章數")
async def get_image_by_item_id(db: Session = Depends(get_db)):
    data = db.execute(text(''' 
    SELECT  A.*, F.Name AS ForumName,
    ISNULL(C.TotalCount,0) AS  TotalCount 
    FROM DBO.WebPage A
    JOIN DBO.Forum F ON A.ForumID=F.ID
    OUTER  APPLY ( 
    SELECT COUNT(B.ID) AS TotalCount FROM DBO.Item B
    WHERE B.WebPageID=A.ID
    )C(TotalCount)
    WHERE A.Enable=1 AND F.Enable=1
    ORDER BY F.Seq, TotalCount DESC
    ''')).all()
    cc=[{'forumName':key,'data':list(g)} for key, g in groupby(data, lambda d : d['ForumName'])] 
    return cc

@router.get("/admin/crawl-task-count", summary="取得論壇的爬蟲工作執行總次數")
async def get_image_by_item_id(db: Session = Depends(get_db)):
    data = db.execute(text(''' 
   SELECT * FROM (
        SELECT count(*) AS TotalCount ,C.Name AS ForumName, C.Seq
        FROM [beauty_wall].[dbo].[WebPageTask] A
        JOIN WebPage B ON A.WebPageID = B.ID 
        JOIN Forum C ON B.ForumID=C.ID
        WHERE B.Enable=1 AND C.Enable=1
        GROUP BY  C.Name,C.Seq
        )X
    ORDER BY X.Seq,TotalCount DESC 
    ''')).all()
    return data