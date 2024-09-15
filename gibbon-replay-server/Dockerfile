FROM node:20-slim AS base
RUN apt update -y; apt install -y curl python3 build-essential
RUN npm install -g pnpm@9.10
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json /app
COPY pnpm-lock.yaml /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
ENV ILA_FIELDS=country,city,country_name,eu,area
ENV ILA_ADD_COUNTRY_INFO=true
ENV ILA_LANGUAGE=en
RUN node ./node_modules/ip-location-api/script/updatedb.mjs

FROM base AS build
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=prod-deps /app/node_modules/ip-location-api/data/ /app/node_modules/ip-location-api/data/
ENV ILA_DATA_DIR=/app/node_modules/ip-location-api/data/
RUN pnpm run build


FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE 3000
ENV ILA_DATA_DIR=/app/node_modules/ip-location-api/data/

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
CMD ["node", "./build/index.js"]
