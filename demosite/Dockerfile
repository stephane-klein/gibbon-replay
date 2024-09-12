FROM node:20-slim AS base
RUN npm install -g pnpm@9.10

WORKDIR /app

COPY ./         /app/
RUN pnpm install
RUN pnpm run build

FROM node:20-slim
RUN apt update -y; apt install -y curl
RUN npm install -g pnpm@9.10

WORKDIR /app

COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./

RUN pnpm install

COPY --from=base /app/build ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:3000 || exit 1

CMD ["node", "./index.js"]
