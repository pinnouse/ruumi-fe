FROM node:lts-alpine

ADD . /app
WORKDIR /app

RUN npm install

ENV HOST 0.0.0.0
ENV API_AUTH your_auth_key
ENV API_URL https://<api_url>/

EXPOSE 3000

CMD ["npm", "start"]
