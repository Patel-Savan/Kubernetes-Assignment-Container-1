FROM node:latest

WORKDIR /container-1

COPY package.json .

RUN npm install

COPY . .

CMD ["node","server.js"]