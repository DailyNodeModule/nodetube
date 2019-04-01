FROM node:10

WORKDIR /web

ADD ./package-lock.json /web/package-lock.json

ADD ./package.json /web/package.json

RUN npm install --unsafe-perm=true

ADD . /web

RUN npm run build

VOLUME /web/dist