FROM node:16.10.0-alpine

WORKDIR /home/app/

COPY . .

RUN yarn install

RUN yarn build

CMD [ "yarn", "run", "start:prod" ]