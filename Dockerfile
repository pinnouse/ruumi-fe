FROM node:latest-alpine

ADD . /app
WORKDIR /app

RUN npm install

ENV API_AUTH your_auth_key
ENV API_URL https://<api_url>/

CMD ["npm", "start"]