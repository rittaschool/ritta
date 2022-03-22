FROM node:17-alpine

WORKDIR /home/app

COPY .yarn/releases/ ./.yarn/releases/
COPY package.json yarn.lock ./

RUN yarn install

COPY src/ .
COPY tsconfig* ./

RUN yarn build

USER node

CMD [ "yarn", "run", "start:prod" ]