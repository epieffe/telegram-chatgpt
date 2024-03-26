FROM node:20-alpine as base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=prod

# Build from sources
FROM base as build
RUN npm install --only=dev
COPY . .
RUN npm run build

#Final image contains only build files
FROM base
COPY --from=build /app/build ./
ENTRYPOINT ["node", "src/main.js"]