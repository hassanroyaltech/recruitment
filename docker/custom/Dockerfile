# Version bumped to 21.1.0
# Changed distribution tag to buster-slim
FROM node:21.1.0

# Set container working directory
WORKDIR /app

# Copy all files
COPY . .

# Copy environment file
COPY ./example.env.staging ./.env

# Install packages
RUN npm install -f --max_old_space_size=8000

# Build packages
RUN npm run-script --max_old_space_size=8000 build

# Install nodejs server
RUN npm install -g serve

# Expose port
EXPOSE 8000

# Run
CMD ["serve","-s","build","-l","8000","--debug"]