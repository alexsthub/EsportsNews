FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 9000
ENTRYPOINT ["node", "index.js"]