FROM node:lts-alpine as build

ARG VITE_API_URL

WORKDIR /app

COPY package*.json ./
COPY vite.config.js index.html tailwind.config.js postcss.config.js tsconfig.json ./

COPY src/ ./src/

RUN npm install

RUN npm run build

# production stage
FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app/dist ./
COPY src/assets ./src/assets

# Install a basic HTTP server to serve static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
