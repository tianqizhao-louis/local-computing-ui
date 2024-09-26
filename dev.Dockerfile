# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to install dependencies
COPY paws/package*.json ./

# Install dependencies
RUN npm install

# Expose the development port (3000 for Next.js)
EXPOSE 3000

# Command to run the Next.js application in development mode
CMD ["npm", "run", "dev"]
