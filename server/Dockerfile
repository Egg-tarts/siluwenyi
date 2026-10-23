FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV AI_BUTLER_PROXY_PORT=80

COPY package.json ./
COPY ai-butler-proxy.js ./

EXPOSE 80

CMD ["node", "ai-butler-proxy.js"]
