FROM node:16-alpine

WORKDIR /var/www/html/backend

COPY ./package*.json ./

RUN npm install

COPY . ./

RUN npm install nodemon -g

EXPOSE 5000
CMD ["nodemon", "index.js"]