#!/bin/bash
# Build script for server (backend)
npm install
# Build frontend first
npm run build:client || vite build
# Use production-specific server entry point to avoid Replit dependencies
esbuild server/index.prod.ts --platform=node --packages=external --bundle --format=esm --outdir=dist