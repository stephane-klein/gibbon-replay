# demosite to test session recording

```sh
$ mise install
$ pnpm install
$ direnv allow
$ pnpm run dev
```

Browse freely to <http://localhost:5174>

After `pnpm install`, don't forget to execute `./scripts/generate-local-pnpm-lock-file.sh` to generate `pnpm-lock.yaml` that will be useful during the Docker image build process.
