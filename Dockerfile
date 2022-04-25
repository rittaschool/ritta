FROM node:lts-alpine AS base
RUN apk update
WORKDIR /app
ARG SCOPE
ENV SCOPE=${SCOPE}
ENV YARN_CACHE_FOLDER=.yarn-cache

FROM base AS pruner
RUN yarn set version stable

RUN yarn global add turbo@1.1.10
COPY . .
RUN turbo prune --scope=${SCOPE} --docker

FROM base AS dev-deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY ./scripts/rebuild-hasher.sh ./rebuild-hasher.sh
RUN yarn install --immutable
RUN ./rebuild-hasher.sh $1

FROM base AS prod-deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=dev-deps /app/${YARN_CACHE_FOLDER} /${YARN_CACHE_FOLDER} 
RUN yarn install --immutable --production --check-cache --ignore-scripts
RUN rm -rf /app/${YARN_CACHE_FOLDER}

FROM base AS builder
COPY --from=dev-deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --scope=${SCOPE} --include-dependencies --no-deps
RUN find . -name node_modules | xargs rm -rf

FROM prod-deps AS runner
COPY --from=builder /app/ .
CMD yarn workspace ${SCOPE} run start