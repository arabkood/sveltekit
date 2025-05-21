FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV PUBLIC_APP_ENV=dev

RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.svelte-kit ./.svelte-kit


EXPOSE 3000
CMD ["node", "build"]
