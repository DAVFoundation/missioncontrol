FROM node:8.2.1

COPY package.json /app/

WORKDIR /app

RUN npm install

RUN npm install -g nodemon

COPY . /app

CMD [ "npm", "start" ]
