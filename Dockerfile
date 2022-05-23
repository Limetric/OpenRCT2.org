# Define base image
ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine

# User
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# Environment
ENV NODE_ENV production

# Working directory
WORKDIR /home/app

# Volumes
VOLUME ["./config"]

# Copy project
COPY package*.json ./
COPY .npmrc ./
COPY README.md ./
COPY dist/ ./dist/
COPY views/ ./views/
COPY public/ ./public/

# Install production dependencies
RUN npm ci --only=production

# Remove .npmrc which may contain secrets
RUN rm -f .npmrc

EXPOSE 80
CMD [ "npm", "start" ]
