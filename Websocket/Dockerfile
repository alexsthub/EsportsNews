FROM node:10.13.0-alpine
WORKDIR /app
COPY . .
COPY package.json .
RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production
CMD npm start