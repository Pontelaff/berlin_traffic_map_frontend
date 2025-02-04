# Use Node.js 18 Alpine as the base image
FROM node:23-alpine

# Set environment variable to fix OpenSSL issues
# CAUTION: This option exposes the build to security risks
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Install necessary dependencies
RUN apk add --no-cache git

# Clone the repository
ADD . /traffic_map_berlin

# Set working directory inside the cloned repo
WORKDIR /traffic_map_berlin

# Install Angular CLI version 9.1.4
RUN npm install -g @angular/cli@9.1.4

# Install @angular-devkit/build-angular
RUN npm install --save-dev @angular-devkit/build-angular

# Install project dependencies
# CAUTION: Not resolving dependency conflicts with --legacy-peer-deps poses security risks
RUN npm install --legacy-peer-deps

# Expose port 4200 for Angular
EXPOSE 4200

# Start the Angular server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
