FROM node:18-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --silent

# Copy source
COPY . .

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Start dev server (react-scripts)
CMD ["npm", "start"]
