FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

EXPOSE 3001

RUN npm install

COPY . .

CMD ["npm", "start"]
