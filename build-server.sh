#!/bin/bash
# Build script for server (backend)
npm install
npm run build:server || esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist