FROM node:lts-alpine AS builder
ARG SCOPE
ENV SCOPE=${SCOPE}
RUN apk update && apk add curl

# Set working directory
WORKDIR /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=${SCOPE} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

FROM node:lts-alpine AS sourcer
ARG SCOPE
RUN apk update
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN pnpm turbo run build test --scope=${SCOPE} --include-dependencies --no-deps

WORKDIR /app/apps/${SCOPE}
CMD pnpm start
