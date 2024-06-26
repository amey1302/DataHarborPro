FROM node:17

WORKDIR /DATAHARBORPRO

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","index.js"]