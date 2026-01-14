FROM node:20-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Prepare `web` app for building
FROM base AS prepare

RUN yarn global add turbo@^2.7.2
COPY . .
RUN turbo prune web --docker

# Install and Build `web` 
FROM base AS builder

COPY --from=prepare /app/out/json/ .
RUN yarn install --frozen-lockfile

COPY --from=prepare /app/out/full/ .
RUN yarn turbo build

# Prepare production image
FROM base AS runner

RUN addgroup --system --gid 1001 user101
RUN adduser --system --uid 1001 user102
USER user102

COPY --from=builder --chown=user102:user101 /app/apps/web/build ./build
COPY --from=builder --chown=user102:user101 /app/apps/web/package.json ./package.json
COPY --from=builder --chown=user102:user101 /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "build/index.js"]