# 女神牆
> 營造一個下班舒壓的好所在
## Features
- 透過web管理頁面執行論壇爬蟲作業
- 精美的女神流水牆
- 使用``celery``套件擴充和開發爬蟲作業程式
- 透過論壇文章標題相似度計算，找出更多相似的文章

## 常用指令
``` bash
# execute celery worker instance 
python3.9 -m celery -A tasks worker --loglevel=info  -E
# show celery tasks
python3.9 -m celery -A tasks events
# open flower celery monitor webiste
python3.9 -m celery -A tasks flower 
# 初始化女神牆資料庫
```
``` sql
SELECT DISTINCT A.*, ISNULL(C.MaxPage,0) AS  MaxPage FROM DBO.WebPage A
OUTER  APPLY ( SELECT TOP 1 B.Page AS MaxPage FROM DBO.Item B
WHERE B.WebPageID=A.ID
ORDER BY B.Page DESC 
)C(MaxPage)
ORDER BY MaxPage DESC
```

