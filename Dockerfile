FROM node:lts-alpine

ADD . /app
WORKDIR /app

ENV HOST_URL ruumi.net
ENV HOST_PROTOCOL https

RUN apk add python

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
