# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nuxt 3 app
RUN npm run build

# Expose the port Nuxt will run on
EXPOSE 3000

# Start the Nuxt app
CMD ["npm", "run", "preview"]
