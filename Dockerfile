# Use node 8 alpine as a parent image
FROM node:8-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 8888

# Run `npm start`
CMD [ "npm", "start" ]