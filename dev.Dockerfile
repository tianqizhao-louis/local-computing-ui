# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to install dependencies
COPY paws/package*.json ./

# Install dependencies
RUN npm install

EXPOSE 8080

# Command to run the Next.js application in development mode
CMD ["npm", "run", "dev"]
