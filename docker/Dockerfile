ARG ALPINE_VERSION=3.16

# Build stage (inspired by: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
FROM node:18-alpine${ALPINE_VERSION} AS builder

WORKDIR /build-stage

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm*.yaml ./
COPY turbo.json .

# Copy just the files we need
COPY ./apps ./apps
COPY ./packages ./packages
COPY ./plugins ./plugins

# Install dependencies and build
RUN pnpm install
RUN pnpm build

###

# Production stage (inspired by: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
FROM alpine:${ALPINE_VERSION}

WORKDIR /usr/src/app

ENV COLLECTOR_PATH=../../../apps/backend/build/main.js
ENV BACKEND_PATH=../../../apps/collector-proxy/build/main.js

RUN apk add --no-cache libstdc++ dumb-init \
    && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
    && chown node:node ./

COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]

USER node

COPY --from=builder /build-stage/node_modules ./node_modules
COPY --from=builder /build-stage/apps ./apps
COPY --from=builder /build-stage/packages ./packages
COPY --from=builder /build-stage/plugins ./plugins

CMD ["dumb-init", "node", "packages/graphql-debugger/build/index.js"]
