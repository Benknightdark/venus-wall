``` sql
SELECT DISTINCT A.*, ISNULL(C.MaxPage,0) AS  MaxPage FROM DBO.WebPage A
OUTER  APPLY ( SELECT TOP 1 B.Page AS MaxPage FROM DBO.Item B
WHERE B.WebPageID=A.ID
ORDER BY B.Page DESC 
)C(MaxPage)
ORDER BY MaxPage DESC
```
# css text animate 
- https://codepen.io/caseycallow/pen/yMNqPY