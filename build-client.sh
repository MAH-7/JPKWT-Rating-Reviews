#!/bin/bash
# Build script for client (frontend)
npm install
npm run build:client || vite build