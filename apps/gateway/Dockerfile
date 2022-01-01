FROM node:16.13-alpine

WORKDIR /home/app/

COPY . .

RUN yarn install

RUN yarn build

CMD [ "yarn", "run", "start:prod" ]