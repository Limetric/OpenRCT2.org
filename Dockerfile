# syntax=docker/dockerfile:1

# Initial arguments
ARG GIT_REF
ARG GIT_SHA
ARG NODE_ENV
ARG CI

# --- Define base image ---
FROM node:18.20.4-alpine AS base

# Environment
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}
ARG GIT_REF
ENV GIT_REF ${GIT_REF}
ARG GIT_SHA
ENV GIT_SHA ${GIT_SHA:-dev}

# User and working directory
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Volumes
VOLUME ["./config", "./customViews"]

# Copy project
COPY --chown=node:node package*.json ./
COPY --chown=node:node README.md ./
COPY --chown=node:node views/ ./views/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node .npmrc ./

# --- Define builder image ---
FROM base AS builder

# Build args
ARG CI

# Copy source files
COPY --chown=node:node src/ ./src/
COPY --chown=node:node frontend/ ./frontend/
COPY --chown=node:node .eslintrc.json ./

# Install all dependencies
RUN npm ci --include=dev

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

# Test and build
RUN npm test
RUN --mount=type=secret,id=sentry_auth_token,uid=1000 npm run build

# --- Define development image ---
FROM base AS development

# Copy
COPY --chown=node:node .eslintrc.json ./

# Volumes
VOLUME ["./src", "./frontend", "./views"]

# Install all dependencies
RUN npm ci --include=dev

EXPOSE 80
CMD [ "npm", "run", "watch" ]

# --- Define release image ---
FROM base AS release

# Copy distribution and frontend resources from builder
COPY --from=builder --chown=node:node /home/node/app/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/app/public/resources/ ./public/resources/

# Install production dependencies
RUN npm ci --only=production

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

EXPOSE 80
CMD [ "npm", "start" ]
