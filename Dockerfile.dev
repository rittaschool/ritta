FROM node:lts-alpine AS builder
ARG SCOPE
ENV SCOPE=${SCOPE}
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=${SCOPE} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

FROM node:lts-alpine AS sourcer
ARG SCOPE
RUN apk update
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build test --scope=${SCOPE} --include-dependencies --no-deps

WORKDIR /app/apps/${SCOPE}
CMD yarn start
