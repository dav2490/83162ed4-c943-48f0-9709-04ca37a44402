FROM node:lts-alpine

ENV OPEN_WEATHER_API_KEY = $OPEN_WEATHER_API_KEY
ENV PORT = $PORT

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./ /usr/src/app

CMD [ "yarn", "docker:start-server" ]

