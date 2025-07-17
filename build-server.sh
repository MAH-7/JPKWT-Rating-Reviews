#!/bin/bash
# Build script for API server only (no frontend)
npm install
# Build API server only - frontend is deployed separately
esbuild server/index.prod.ts --platform=node --packages=external --bundle --format=esm --outdir=dist