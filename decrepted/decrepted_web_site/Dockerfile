FROM node:16.20.2-slim AS Build
WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:alpine
# COPY nginx.site.template /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=Build /usr/src/app/dist/WebSite/browser/. .
# EXPOSE 4000
ENTRYPOINT ["nginx", "-g", "daemon off;"]


# FROM node:16.13.2-alpine AS deploy
# ENV NODE_ENV=production
# WORKDIR /app
# COPY --from=Build  /usr/src/app/dist/.  ./dist/.
# EXPOSE 4000
# CMD [ "node","./dist/WebSite/server/main.js" ]
