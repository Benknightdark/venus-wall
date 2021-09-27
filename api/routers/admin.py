from sqlalchemy.sql.expression import and_, desc, false, text
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter, Request
from sqlalchemy.orm import Session
from models import models, view_models
from datetime import datetime
import uuid

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
    for json auto
    -- ORDER BY F.Seq, TotalCount DESC
    ''')).all()
    return data