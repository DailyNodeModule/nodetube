FROM node:10

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

ADD ./package-lock.json /app/package-lock.json

ADD ./package.json /app/package.json

RUN npm install --unsafe-perm=true

ADD . /app

CMD npm start