FROM node:20-slim AS base
RUN apt update -y; apt install -y curl
RUN npm install -g pnpm@9.10

WORKDIR /app

COPY ./package.json         /app/
RUN pnpm install

COPY ./vite.config.js       /app/
COPY ./svelte.config.js     /app/
COPY ./src/                 /app/src/

RUN pnpm run build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:3000 || exit 1

CMD ["node", "./build/index.js"]
