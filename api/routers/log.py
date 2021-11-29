import httpx
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import NVARCHAR
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session
from models import models, view_models
router = APIRouter()


@router.get("/log/worker", summary="取得worker的執行記錄")
async def get_worker_log( offset: int, limit: int,db: Session = Depends(get_db)):
    data=db.execute(text(f''' 
    SELECT  
    A.ID,
    A.CreateDateTime,
    JSON_VALUE(A.RawData,'$.data.topic') AS Topic,
    JSON_VALUE(A.RawData,'$.data.data.Name') AS WebPageName ,
    JSON_VALUE(A.RawData,'$.data.data.Url') AS Url ,
    JSON_VALUE(A.RawData,'$.data.data.Start') AS Start ,
    JSON_VALUE(A.RawData,'$.data.data.End') AS [End] ,
    JSON_VALUE(A.RawData,'$.data.traceid') AS TraceID ,
    JSON_VALUE(A.RawData,'$.data.data.ID') AS WebPageID ,
    C.ID AS ForumID,
    C.Name AS ForumName
    FROM [beauty_wall].[dbo].[CrawlerLog] A
    JOIN [beauty_wall].[dbo].[WebPage] B ON JSON_VALUE(A.RawData,'$.data.data.ID')=B.ID
    JOIN [beauty_wall].[dbo].[Forum] C ON B.ForumID=C.ID
    WHERE JSON_VALUE(A.RawData,'$.topic')='process-log' AND JSON_VALUE(A.RawData,'$.data.data.Name') IS NOT NULL
    ORDER BY CreateDateTime DESC 
    OFFSET {offset} ROWS
    FETCH NEXT {limit} ROWS ONLY
    ''')).all()
    return data

@router.get("/log/crawler", summary="取得crawler的執行記錄")
async def get_worker_log( offset: int, limit: int,db: Session = Depends(get_db)):
    data=db.execute(text(f''' 
    SELECT  
    A.ID,
    A.CreateDateTime,
    JSON_VALUE(A.RawData,'$.data.topic') AS Topic,
    JSON_VALUE(A.RawData,'$.data.data.root_page_url') AS RootPageUrl ,
    JSON_VALUE(A.RawData,'$.data.data.i') AS Page ,
    JSON_VALUE(A.RawData,'$.data.data.id') AS WebPageID ,
    C.ID AS ForumID,
    B.Name AS WebPageName,
    C.Name AS ForumName
    FROM [beauty_wall].[dbo].[CrawlerLog] A
    JOIN [beauty_wall].[dbo].[WebPage] B ON JSON_VALUE(A.RawData,'$.data.data.id')=B.ID
    JOIN [beauty_wall].[dbo].[Forum] C ON B.ForumID=C.ID
    WHERE JSON_VALUE(A.RawData,'$.topic')='process-log' AND JSON_VALUE(A.RawData,'$.data.data.i') IS NOT NULL
    ORDER BY CreateDateTime DESC 
    OFFSET {offset} ROWS
    FETCH NEXT {limit} ROWS ONLY
    ''')).all()
    return data


@router.get("/log/crawler", summary="取得processor的執行記錄")
async def get_processor_log( offset: int, limit: int,db: Session = Depends(get_db)):
    data=db.execute(text(f''' 
    SELECT  A.ID,A.CreateDateTime,
        JSON_VALUE(A.RawData,'$.source') AS Source,
        JSON_VALUE(A.RawData,'$.topic') AS Topic,
        JSON_VALUE(A.RawData,'$.traceid') AS TraceID,
        JSON_VALUE(A.RawData,'$.data.Item.Title') AS Title,
        JSON_VALUE(A.RawData,'$.data.Item.Url') AS Url,
        JSON_QUERY(A.RawData,'$.data.Images') AS Images,
        B.Name AS WebPageName,
        B.ID AS WebPageID,
        C.Name AS ForumName,
        C.ID AS ForumID
    FROM [beauty_wall].[dbo].[CrawlerLog] A
    JOIN [beauty_wall].[dbo].[WebPage] B ON JSON_VALUE(A.RawData,'$.data.Item.WebPageID')=B.ID
    JOIN [beauty_wall].[dbo].[Forum] C ON B.ForumID=C.ID
    ORDER BY CreateDateTime DESC 
    OFFSET {offset} ROWS
    FETCH NEXT {limit} ROWS ONLY
    ''')).all()
    return data


