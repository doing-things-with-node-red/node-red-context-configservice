FROM node:14-alpine AS builder

ENV NODE_ENV=production

WORKDIR /tmp/builder
COPY package.json ./
RUN apk update && apk add --no-cache --virtual \
    .gyp \
    build-base \
    linux-headers \
    udev \
    g++ \
    make \
    python3 && \
    npm i --no-audit && \
    npm prune --production

FROM node:14-alpine AS nodered

ENV NODE_ENV=production
ENV USER_HOME=/home/nodejs
ENV APP_HOME=/opt/app

WORKDIR $USER_HOME/nodered
RUN npm init -y

WORKDIR $APP_HOME
COPY --from=builder /tmp/builder/node_modules node_modules
COPY package.json red.js settings.js ./
EXPOSE 8000
CMD ["node", "--unhandled-rejections=strict", "red.js"]