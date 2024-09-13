#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

docker push stephaneklein/gibbon-replay-server:latest
