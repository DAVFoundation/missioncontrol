# Use node 8 as a parent image
FROM node:8.2.1

# Add app user
RUN useradd --user-group --create-home --shell /bin/false app

# Set HOME environment variable
ENV HOME=/home/app

# Change to the new user
USER app

# Copy package files
COPY package.json npm-shrinkwrap.json $HOME/missioncontrol/

# Set working directory
WORKDIR $HOME/missioncontrol

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 8888

# Run `npm start`
CMD [ "npm", "start" ]