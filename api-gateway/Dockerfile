# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY .htpasswd  /etc/nginx/.htpasswd
#v1.19-latest
FROM envoyproxy/envoy:v1.21-latest
COPY ./envoy.yaml /etc/envoy/
EXPOSE 8049