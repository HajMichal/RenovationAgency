FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start"]