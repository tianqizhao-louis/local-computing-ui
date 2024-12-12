# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY paws/package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY paws/ .

# Build the application
RUN npm run build

# Install only production dependencies
RUN npm prune --production

# Stage 2: Production image
FROM node:18-alpine AS runner

# Set environment variables for production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the build output and necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 8080

# Run the application using serve
CMD ["serve", "-s", "dist", "-l", "8080"]
