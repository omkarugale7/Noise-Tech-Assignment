from node:alpine
# Create app directory
WORKDIR /usr/node/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001
CMD [ "npm", "start" ]