#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

docker push gibbon-replay-server:latest
