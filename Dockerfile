FROM node:8.16.0-jessie-slim

RUN mkdir -p /usr/src/app/swellapi
EXPOSE 5000
WORKDIR /usr/src/app/swellapi

COPY ./package.json ./

RUN cat package.json \
    && yarn install

COPY ./ ./

CMD ["npm","start"]