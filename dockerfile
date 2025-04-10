# Build stage for Angular
FROM node:22.14.0-alpine AS angular-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build stage for NestJS
FROM node:22.14.0-alpine AS nestjs-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:22.14.0-alpine AS production
WORKDIR /app

# Install production dependencies for NestJS
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built NestJS app
COPY --from=nestjs-build /app/backend/dist ./dist
COPY --from=nestjs-build /app/backend/node_modules ./node_modules

# Create the directory structure first
RUN mkdir -p /frontend/dist/2hangman/browser

# Copy Angular files to the expected location
COPY --from=angular-build /app/frontend/dist/2hangman/browser /frontend/dist/2hangman/browser

# Verify files exist (for debugging)
RUN ls -la /frontend/dist/2hangman/browser || echo "Directory empty or doesn't exist"

# Add healthcheck
HEALTHCHECK --interval=60s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Expose NestJS port
EXPOSE 3000

# Start NestJS application
CMD ["node", "dist/main"]