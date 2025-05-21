FROM node:24.0.2-alpine AS base
RUN corepack enable
RUN apk -U upgrade
RUN mkdir -p /opt/api && chown -R node:node /opt/api
USER node
WORKDIR /opt/api

FROM base AS build
RUN corepack enable
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./package-lock.json ./
RUN npm i --omit=dev --legacy-peer-deps
COPY --chown=node:node . .
RUN npx nx build api

FROM base AS prod
RUN corepack enable
ENV NODE_ENV=production
WORKDIR /opt/api
COPY --from=build /opt/api/dist/apps/api ./
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./package-lock.json ./
RUN npm i --legacy-peer-deps
CMD ["node", "main.mjs"]