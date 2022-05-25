# syntax=docker/dockerfile:1

# Define base image
FROM node:16-alpine AS base

# User
RUN addgroup --system app && adduser --system --ingroup app app
USER node

# Environment
ENV NODE_ENV production

# Working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

#RUN sudo chmod -R 777 /home/node/app

# Volumes
VOLUME ["./config", "./customViews"]

# Copy project
COPY --chown=node:node package*.json ./
COPY --chown=node:node README.md ./
COPY --chown=node:node views/ ./views/
COPY --chown=node:node public/ ./public/

# Define builder image
FROM base AS builder
COPY --chown=node:node src/ ./src/
COPY --chown=node:node frontend/ ./frontend/
COPY --chown=node:node .npmrc ./
COPY --chown=node:node .eslintrc.json ./

# Install all dependencies
RUN npm ci --include=dev

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

# Test and build
RUN npm test
RUN npm run build

# Define release image
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
