# 女神牆
> 營造一個下班舒壓的好所在
## ✨Features✨
- 透過web管理頁面執行論壇爬蟲作業
- 精美的女神流水牆
- 使用``dapr`` + ``keda``擴充和開發爬蟲作業程式
- 透過論壇文章標題相似度計算，找出更多相似的文章
## 🔥系統截圖🔥
- > 女神流水牆
<center><img src="./screenshots/1.png" /></center>
<br/>

- > 管理者儀表板
<center><img src="./screenshots/4.png" /></center>
<br/>

- > 論壇管理
<center><img src="./screenshots/2.png" /></center>
<br/>

- > 文章管理
<center><img src="./screenshots/3.png" /></center>
<br/>

## 開發環境啟動方式
### 一、啟動資料庫
1. 在專案根目錄執行 ```docker compose up -d```指令
2. 如果是第一次啟動系統，需在專案根目錄執行```docker exec -it venus-wall_db_1 /opt/mssql-tools/bin/sqlcmd -U SA -P YourStrong!Passw0rd  -W -i init_db.sql```指令，以產生系統需要用到的資料庫
### 二、啟動dapr side-car服務
1. 在專案根目錄執行```./start-dapr-sidecar.ps1 ```指令
### 三、啟動專案裡所有的程式
1. 使用```visual studio code```開啟專案
2. 按下```F5鍵```後，即可以啟動所有程式 

## 部署系統至Kubernetes
- [參考此文件](./deploy#readme)
## 常用指令
``` bash
# 建立python 虛擬環境
 python -m virtualenv venv --python=python3.9.7
# execute celery worker instance 
python3.9 -m celery -A tasks worker --loglevel=info  -E
# show celery tasks
python3.9 -m celery -A tasks events
# open flower celery monitor webiste
python3.9 -m celery -A tasks flower 
# scaffold dbcontext
dotnet ef dbcontext scaffold 'Server=.,9487;Database=beauty_wall;user id=sa;password=YourStrong!Passw0rd' 'Microsoft.EntityFrameworkCore.SqlServer'  -o Models/DBModels -f -c BeautyDBContext --use-database-names --no-build --json
```



