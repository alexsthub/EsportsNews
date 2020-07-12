FROM node:12.13.0 AS builder
WORKDIR /usr/app
COPY . .
RUN npm install && npm run build

FROM node:12.13.0-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --quiet --only=production
COPY --from=builder /usr/app/build ./build
EXPOSE 9000
CMD ["node", "/app/build/index.js"]