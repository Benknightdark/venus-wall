FROM node:16.13.2-slim AS Build
WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm run build:ssr

FROM node:16.13.2-alpine AS deploy
ENV NODE_ENV=production
WORKDIR /app
COPY --from=Build  /usr/src/app/dist/.  ./dist/.
EXPOSE 4000
CMD [ "node","./dist/WebSite/server/main.js" ]
