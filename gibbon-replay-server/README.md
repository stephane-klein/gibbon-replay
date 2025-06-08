# rrweb-replay-server

```sh
$ mise install
$ pnpm install
$ pnpm rebuild
$ node ./node_modules/ip-location-api/script/updatedb.mjs
$ pnpm run dev
```

Go to <http://localhost:5173> to wath replays.

Default login `admin`, password `password`.

## Utilities commands

```sh
$ pnpm run compute_all_sessions_duration
$ pnpm run compute_all_sessions_has_user_actions
```

## Eslint

```sh
$ pnpm run eslint-check
```

## Instruction for gibbon-replay maintainers

How to build Docker image:

```sh
$ ./scripts/build-docker.sh
```
