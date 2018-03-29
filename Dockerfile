FROM node:9.3.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python make g++

RUN npm install -g nodemon

WORKDIR /app

COPY ./package.json /app/
RUN npm install

COPY . /app

CMD [ "npm", "start" ]
EXPOSE 8888

