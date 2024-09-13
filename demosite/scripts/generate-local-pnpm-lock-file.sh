#!/usr/bin/env bash
# This script generates a pnpm-lock.yaml file in the local directory,
# without including dependencies from workspace projects.
# For example, the version of gibbon-replay-js installed is the version
# published on npmjs.
# This point is crucial to ensure the correct operation of the docker build
# command when creating the Docker image of the demo-site project.
set -e

cd "$(dirname "$0")/../"

export npm_config_link_workspace_packages=false
export npm_config_prefer_workspace_packages=false
export npm_config_shared_workspace_lockfile=false

pnpm install --lockfile-only
