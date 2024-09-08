# rrweb-replay POC

In this POC, my goal was to create a minimalist, easy-to-deploy browser session recorder based on [rrweb](https://github.com/rrweb-io/rrweb/).

Session events are recorded and sent to an HTTP POST endpoint implemented in [SvelteKit](https://kit.svelte.dev/), these data are then stored in [KeyDB](https://github.com/Snapchat/KeyDB) (Redis fork).

The `/replay/` page loads a session's events from KeyDB and sends them to the [`rrweb-player`](https://github.com/rrweb-io/rrweb/tree/master/packages/rrweb-player/) component, which is replaying the session.

More information (in french): https://notes.sklein.xyz/Notes-%C3%A9ph%C3%A9m%C3%A8res/2024-09-07_2240


```sh
$ mise install
$ docker compose up -d --wait
$ pnpm install
$ pnpm run dev
```

Instructions for use: browse freely to <http://localhost:5173> and then go to <http://localhost:5173/replay/> to see the replay of your session.
