# syntax=docker/dockerfile:1

# Define base image
FROM node:16-alpine AS base

# User
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# Environment
ENV NODE_ENV production

# Working directory
WORKDIR /home/app

# Volumes
VOLUME ["./config", "./customViews"]

# Copy project
COPY package*.json ./
COPY README.md ./
COPY views/ ./views/
COPY public/ ./public/

# Define builder image
FROM base AS builder
COPY src/ ./src/
COPY frontend/ ./frontend/
COPY .npmrc ./
COPY .eslintrc.json ./

# Install all dependencies
RUN npm ci --include=dev

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

# Test and build
RUN npm test
RUN npm run build

# Define release image
FROM base AS release

# Copy project
COPY --from=builder ./dist/ ./dist/

# Install production dependencies
RUN npm ci --only=production

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

EXPOSE 80
CMD [ "npm", "start" ]
