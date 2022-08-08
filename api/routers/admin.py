from itertools import groupby
from sqlalchemy.sql.expression import text
from dependencies import get_db
from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session


router = APIRouter()


@router.get("/admin/forum-count", summary="取得論壇文章數")
async def get_image_by_item_id(db: Session = Depends(get_db)):
    data = db.execute(text(''' 
    SELECT  A.*, F.Name AS ForumName,
    ISNULL(C.TotalCount,0) AS  TotalCount ,
	ISNULL(E.ImageCount,0) AS  ImageCount 
    FROM DBO.WebPage A
    JOIN DBO.Forum F ON A.ForumID=F.ID

    OUTER  APPLY ( 
    SELECT COUNT(B.ID) AS TotalCount FROM DBO.Item B
    WHERE B.WebPageID=A.ID
    )C(TotalCount)

	OUTER APPLY(
	SELECT COUNT(A2.ID) as ImageCount FROM Image A2
	JOIN Item B2 ON A2.ItemID = B2.ID
	JOIN WebPage C2 ON B2.WebPageID = C2.ID
	WHERE C2.ID=A.ID
	)E(ImageCount)

    WHERE A.Enable=1 AND F.Enable=1
    ORDER BY F.Seq, TotalCount DESC
    ''')).all()
    group_data = [{'forumName': key, 'data': list(g)}
                  for key, g in groupby(data, lambda d: d['ForumName'])]
    for group in group_data:
        group['totalCount'] = sum(
            list(map(lambda x: int(x['TotalCount']), group['data'])))
        group['imageCount'] = sum(
            list(map(lambda x: int(x['ImageCount']), group['data'])))            
    return group_data


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
