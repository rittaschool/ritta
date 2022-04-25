FROM node:lts-alpine AS base
RUN apk update
WORKDIR /app
ARG SCOPE
ENV SCOPE=${SCOPE}
ENV YARN_CACHE_FOLDER=.yarn-cache

FROM base AS pruner
RUN yarn set version stable

RUN npm install -g turbo@1.1.10
COPY . .
RUN turbo prune --scope=${SCOPE} --docker

FROM base AS dev-deps
RUN yarn set version stable
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY ./scripts/rebuild-hasher.sh ./rebuild-hasher.sh
RUN yarn install
RUN ./rebuild-hasher.sh $1

FROM base AS prod-deps
RUN yarn set version stable
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=dev-deps /app/${YARN_CACHE_FOLDER} /${YARN_CACHE_FOLDER} 
RUN yarn install --production --check-cache --ignore-scripts
RUN rm -rf /app/${YARN_CACHE_FOLDER}

FROM base AS builder
COPY --from=dev-deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN yarn set version stable
RUN yarn install
RUN yarn turbo run build --scope=${SCOPE} --include-dependencies --no-deps
RUN find . -name node_modules | xargs rm -rf

FROM prod-deps AS runner
COPY --from=builder /app/ .
CMD yarn workspace ${SCOPE} run start