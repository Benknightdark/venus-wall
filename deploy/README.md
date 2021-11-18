# 安裝minikube和相關套件
```bash
# 啟動minikube 16384  4096
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
kubectl delete secret venus-wall-secrets
kubectl create secret generic venus-wall-secrets --from-literal="DB_CONNECT_STRING=mssql+pymssql://sa:MyC0m9l&xPbbssw0rd@mssql-deployment/beauty_wall?charset=utf8"
# 安裝 sql server 
docker build --pull --rm --no-cache -f "./db/sql_server/Dockerfile" -t sql-server "./db/sql_server"
docker tag sql-server:latest localhost:5000/sql-server:latest
docker push localhost:5000/sql-server:latest 
kubectl apply -f ./deploy/sqlserver.yaml
/opt/mssql-tools/bin/sqlcmd -U SA -P 'MyC0m9l&xPbbssw0rd'  -W -i init_db.sql
# 新增 keda config
kubectl apply -f ./deploy/redis-scale.yaml
```
# 開啟local registry對外連線
```bash
docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube ip):5000"
```
# 部署服務至minikube
```bash
# 更新 api-service
docker build --pull --rm --no-cache -f "./api/Dockerfile" -t api-service "./api"
docker tag api-service:latest localhost:5000/api-service:latest
docker push localhost:5000/api-service:latest 
helm un api-service 
helm upgrade  --install  api-service ./deploy/api-service
# 更新 jkf-worker
docker build --pull --rm --no-cache -f "./task_workers/jkf_worker/Dockerfile" -t jkf-worker "./task_workers/jkf_worker"
docker tag  jkf-worker:latest localhost:5000/jkf-worker:latest
docker push localhost:5000/jkf-worker:latest 
helm un  jkf-worker 
helm upgrade  --install   jkf-worker ./deploy/jkf-worker
# 更新 data-processor
docker build --pull --rm --no-cache -f "./task_workers/data_processor/Dockerfile" -t data-processor "./task_workers/data_processor"
docker tag  data-processor:latest localhost:5000/data-processor:latest
docker push localhost:5000/data-processor:latest 
helm un  data-processor 
helm upgrade  --install   data-processor ./deploy/data-processor





```
# Command
```bash
minikube dashboard
minikube service dapr-dashboard -n dapr-system
minikube service kibana-kibana -n dapr-monitoring
minikube service zipkin
minikube service api-service
```