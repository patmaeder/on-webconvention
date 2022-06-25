FROM node:alpine

RUN apk add --no-cache bash

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# create persistent volume
VOLUME /usr/src/storage

# install dependencies
RUN npm ci

RUN npm run build

EXPOSE 3000

# set permissions
RUN ["chmod", "+x", "./entrypoint.sh"]

CMD ["/usr/src/entrypoint.sh"]