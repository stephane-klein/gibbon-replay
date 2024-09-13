#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

docker build . -t gibbon-replay-server:latest
