FROM node:25-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm i @google/genai
RUN npm install

COPY . .

CMD ["npx", "nodemon", "server.js"]