# Version bumped to 21.1.0
# Changed distribution tag to buster-slim
FROM node:21.1.0

# Set container working directory
WORKDIR /app

# Copy all files
COPY . .

# Install packages
RUN npm i -f

# Expose port
EXPOSE 3000

# Run
CMD ["npm", "start"]