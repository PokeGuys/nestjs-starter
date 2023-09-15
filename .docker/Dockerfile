# Installer Stage
FROM node:18-alpine AS installer

## Create app directory
WORKDIR /app

## A wildcard is used to ensure both package.json AND pnpm-lock.yaml are copied
COPY package.json pnpm-lock.yaml ./

## Install pnpm
RUN npm install -g pnpm

## Install app dependencies
RUN pnpm install --frozen-lockfile

## Copy all the files
COPY . .

RUN ls -la

# Build Stage
FROM node:18-alpine AS builder

## Create app directory
WORKDIR /app

## Copy artifacts from installer
COPY --from=installer /app/. .

## Install pnpm
RUN npm install -g pnpm

## Install development dependencies
RUN pnpm install

## Build application
RUN pnpm build

## Create version file
ARG COMMIT_HASH
ARG PIPELINE_ID
RUN echo "{\"commit\":\"$COMMIT_HASH\",\"build_number\":\"$PIPELINE_ID\"}" > VERSION.json

# Run Stage
FROM keymetrics/pm2:16-alpine

## Setup working directory
WORKDIR /app

ENV NO_COLOR=true

## Copy from installer, for production dependencies
COPY --from=installer /app/pm2.json .
COPY --from=installer /app/package.json .
COPY --from=installer /app/node_modules/. node_modules/.

## Copy static files from builder stage to be service by node server
COPY --from=builder /app/dist/. dist/.
COPY --from=builder /app/VERSION.json .

## Setup image entry point
CMD [ "npm", "run", "start:prod" ]
