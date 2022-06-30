FROM node:alpine

RUN apk add --no-cache bash

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# create persistent volume
VOLUME /usr/src/storage

RUN npm i y-websocket

EXPOSE 1234

CMD ["npx","y-websocket"]