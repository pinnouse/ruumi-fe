FROM node:lts-alpine

ADD . /app
WORKDIR /app

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
