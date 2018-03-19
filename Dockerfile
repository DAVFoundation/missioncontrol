FROM node:9.3.0-alpine

COPY package.json /app/

WORKDIR /app

RUN npm install

RUN npm install -g nodemon

COPY . /app

CMD [ "npm", "start" ]

EXPOSE 8888

