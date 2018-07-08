FROM node:latest

RUN mkdir /server-starter
WORKDIR /server-starter

COPY ./src/package.json /server-starter
RUN npm install

COPY ./src /server-starter