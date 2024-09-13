#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

./scripts/generate-local-pnpm-lock-file.sh
docker build . -t demosite:latest
