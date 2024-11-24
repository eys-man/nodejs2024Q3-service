FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE $PORT
CMD [ "npm", "run", "start:dev" ]
