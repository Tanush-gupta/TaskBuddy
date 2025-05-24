# client/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js serves on
EXPOSE 3000

# Start the server (use 'dev' for development, 'start' for production)
CMD ["npm", "start"]
