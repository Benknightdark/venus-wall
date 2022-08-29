# FROM node:alpine AS builder
# WORKDIR /app
# COPY . .
# RUN npm i 
# ENV NODE_ENV production
# RUN npm run build
# EXPOSE 3000
# CMD ["npm", "start"]




# FROM node:latest AS builder
# WORKDIR /app
# COPY . .
# RUN npm config set unsafe-perm true
# RUN npm i 
# RUN npm run build 


# FROM node:alpine AS runner
# WORKDIR /app
# ENV NODE_ENV production
# RUN addgroup --system --gid 1001 bloggroup
# RUN adduser --system --uid 1001 bloguser
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder --chown=bloguser:bloggroup /app/next.config.js ./
# COPY --from=builder --chown=bloguser:bloggroup /app/.next/standalone ./
# COPY --from=builder --chown=bloguser:bloggroup /app/.next/static ./.next/static

# USER bloguser

# EXPOSE 3000

# ENV PORT 3000

# CMD ["node", "server.js"]


FROM node:alpine AS deps
RUN apk add git
WORKDIR /app
COPY package.json  ./  
RUN npm i 

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build 

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 webgroup
RUN adduser --system --uid 1001 webuser
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=webuser:webgroup /app/.next/standalone ./
COPY --from=builder --chown=webuser:webgroup /app/.next/static ./.next/static
USER webuser
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]