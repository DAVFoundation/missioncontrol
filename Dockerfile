FROM node:8.2.1

COPY package.json /app/

WORKDIR /app

RUN npm install

COPY . /app

CMD [ "npm", "start" ]
