FROM node:17-alpine
ARG BUILD_CONTEXT

WORKDIR /home/app

COPY package.json .
COPY yarn.lock .

COPY ./apps/$BUILD_CONTEXT/package.json apps/$BUILD_CONTEXT/
COPY ./apps/$BUILD_CONTEXT/tsconfig* apps/$BUILD_CONTEXT/
COPY ./apps/$BUILD_CONTEXT/src apps/$BUILD_CONTEXT/src

RUN ls /home/app/apps/$BUILD_CONTEXT

WORKDIR /home/app/apps/$BUILD_CONTEXT

RUN yarn install
RUN yarn build

RUN ls /home/app/apps/$BUILD_CONTEXT

CMD [ "yarn", "run", "start:prod" ]