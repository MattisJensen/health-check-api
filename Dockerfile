FROM node:25-alpine3.21 AS builder

WORKDIR /opt/app

COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy source
COPY . .

# Compile the TypeScript code to JavaScript
RUN npm run build

#------------------------
    
FROM node:25-alpine3.21 AS runner

WORKDIR /opt/app

# Copy the compiled code from the builder stage
COPY --from=builder /opt/app/dist ./dist

# Copy package files to install production dependencies
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 3000

# Run the compiled JS
CMD ["node", "dist/index.js"]