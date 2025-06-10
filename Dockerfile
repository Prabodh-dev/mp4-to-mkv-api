# Use official Node.js base image
FROM node:18

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Create folders if not already present
RUN mkdir -p uploads converted

# Expose the port
EXPOSE 3000

# Run the server
CMD ["node", "index.js"]
