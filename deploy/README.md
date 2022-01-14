# 一、啟動minikube和安裝套件
```bash
# 啟動minikube 
minikube start --cpus=4 --memory=7933
minikube addons enable dashboard
minikube addons enable ingress
minikube addons enable registry
minikube addons enable metrics-server
# 安裝dapr
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --namespace dapr-system --create-namespace  --set global.logAsJson=true --set global.ha.enabled=true  --wait
kubectl replace -f https://raw.githubusercontent.com/dapr/dapr/v1.5.0/charts/dapr/crds/subscription.yaml
# 安裝 zipkin
kubectl create deployment zipkin --image openzipkin/zipkin
kubectl expose deployment zipkin --type ClusterIP --port 9411
# 安裝 redis
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm upgrade --install redis bitnami/redis --set auth.password=secretpassword
# 安裝 keda
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda -n keda --create-namespace
# 新增 dapr config
kubectl apply -f ./deploy/config.yaml
# 建立 secrets
kubectl delete secret mssql
kubectl create secret generic mssql --from-literal=SA_PASSWORD="MyC0m9l&xPbbssw0rd"
kubectl delete secret venuswallsecrets
kubectl create secret generic venuswallsecrets --from-literal="DB_CONNECT_STRING=mssql+pymssql://sa:MyC0m9l&xPbbssw0rd@mssql-deployment/beauty_wall?charset=utf8" --from-literal="DOTNET_DB_CONNECT_STRING=server=mssql-deployment;Database=beauty_wall;user id=sa;password=MyC0m9l&xPbbssw0rd"
# 新增 keda config
kubectl apply -f ./deploy/redis-scale.yaml
# 開啟local registry對外連線
docker run --rm -it -d --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube ip):5000"
# 安裝 sql server 
docker build --pull --rm --no-cache -f "./db/sql_server/Dockerfile" -t sql-server "./db/sql_server"
docker tag sql-server:latest localhost:5000/sql-server:latest
docker push localhost:5000/sql-server:latest
kubectl apply -f ./deploy/sqlserver.yaml
# 在sql server pod裡執行下列Command
/opt/mssql-tools/bin/sqlcmd -U SA -P 'MyC0m9l&xPbbssw0rd'  -W -i init_db.sql
```

# 二、部署服務至minikube
```bash
# 更新 api-service
docker build --pull --rm --no-cache -f "./api/Dockerfile" -t api-service "./api"
docker tag api-service localhost:5000/api-service:200
docker push localhost:5000/api-service:200 
helm upgrade  --install  api-service ./deploy/api-service --set=image.tag=200

# 更新 jkf-worker
docker build --pull --rm --no-cache -f "./task_workers/jkf_worker/Dockerfile" -t jkf-worker "./task_workers/jkf_worker"
docker tag  jkf-worker localhost:5000/jkf-worker:200
docker push localhost:5000/jkf-worker:200 
helm upgrade  --install   jkf-worker ./deploy/jkf-worker --set=image.tag=200

# 更新 jkf-crawler
docker build --pull --rm --no-cache -f "./task_workers/jkf_crawler/Dockerfile" -t jkf-crawler "./task_workers/jkf_crawler"
docker tag  jkf-crawler localhost:5000/jkf-crawler:200
docker push localhost:5000/jkf-crawler:200
helm upgrade  --install   jkf-crawler ./deploy/jkf-crawler --set=image.tag=200

# 更新 mdk-worker
docker build --pull --rm --no-cache -f "./task_workers/mdk_worker/Dockerfile" -t mdk-worker "./task_workers/mdk_worker"
docker tag  mdk-worker localhost:5000/mdk-worker:200
docker push localhost:5000/mdk-worker:200 
helm upgrade  --install   mdk-worker ./deploy/mdk-worker --set=image.tag=200

# 更新 mdk-crawler
docker build --pull --rm --no-cache -f "./task_workers/mdk_crawler/Dockerfile" -t mdk-crawler "./task_workers/mdk_crawler"
docker tag  mdk-crawler localhost:5000/mdk-crawler:200
docker push localhost:5000/mdk-crawler:200 
helm upgrade  --install   mdk-crawler ./deploy/mdk-crawler --set=image.tag=200

# 更新 data-processor
docker build --pull --rm --no-cache -f "./task_workers/data_processor/Dockerfile" -t data-processor "./task_workers/data_processor"
docker tag  data-processor localhost:5000/data-processor:200
docker push localhost:5000/data-processor:200 
helm upgrade  --install   data-processor ./deploy/data-processor --set=image.tag=200


# 更新 web-site
docker build --pull --rm  -f "./web_site/Dockerfile" -t web-site "./web_site"
docker tag  web-site localhost:5000/web-site:201
docker push localhost:5000/web-site:201
helm upgrade  --install   web-site ./deploy/web-site --set=image.tag=201


# 更新 api-gateway
docker build --pull --rm --no-cache -f "./api-gateway/Dockerfile" -t api-gateway "./api-gateway"
docker tag  api-gateway localhost:5000/api-gateway:200
docker push localhost:5000/api-gateway:200
helm upgrade  --install   api-gateway ./deploy/api-gateway --set=image.tag=200
```
# 三、開啟女神牆網站的對外連線
```
minikube service api-gateway
```
# 其他指令
```bash
minikube dashboard
minikube service dapr-dashboard -n dapr-system
minikube service kibana-kibana -n dapr-monitoring
minikube service zipkin
kubectl delete role access-secrets
kubectl create role access-secrets --verb=get,list --resource=secrets
kubectl delete rolebinding default-api-service-to-secrets
kubectl create rolebinding --role=access-secrets default-api-service-to-secrets --serviceaccount=default:api-service

```

# 參考連結
- https://ithelp.ithome.com.tw/articles/10195944