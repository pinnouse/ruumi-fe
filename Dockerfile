FROM node:lts-alpine

ADD . /app
WORKDIR /app

RUN npm ci

ENV HOST 0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
