``` sql
SELECT DISTINCT A.*, ISNULL(C.MaxPage,0) AS  MaxPage FROM DBO.WebPage A
OUTER  APPLY ( SELECT TOP 1 B.Page AS MaxPage FROM DBO.Item B
WHERE B.WebPageID=A.ID
ORDER BY B.Page DESC 
)C(MaxPage)
ORDER BY MaxPage DESC
```
``` bash
# execute celery worker instance 
python3.9 -m celery -A tasks worker --loglevel=info  -E
# show celery tasks
python3.9 -m celery -A tasks events
# open flower celery monitor webiste
python3.9 -m celery -A tasks flower 
```
# css text animate 
- https://codepen.io/caseycallow/pen/yMNqPY

d9c7dd54-162e-41f4-8f1b-6ac0aa21d430