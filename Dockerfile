FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy application files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 4000

# Start the application
CMD [ "node", "src/server/server.js" ]