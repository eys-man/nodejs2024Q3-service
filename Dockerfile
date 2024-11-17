FROM node:22-alpine3.20
WORKDIR /app
COPY package*.json ./
RUN npm install --force 
COPY --chown=node:node . .
CMD [ "npm", "run", "start:dev" ]
