FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 4000
EXPOSE 8080

CMD ["node", "backend/server.js"]
