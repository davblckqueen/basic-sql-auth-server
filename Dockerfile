FROM node:16.17.0-alpine

# Create app directory
WORKDIR /app

# Install app dependencies - For NPM use: `COPY package.json package-lock.lock ./`
COPY package.json /app 
# For NPM use: `RUN npm ci`
RUN npm i

COPY . /app

# You can update this to run other NodeJS apps
CMD [ "npm", "run", "start:dev" ]
