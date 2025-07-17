# Render Deployment Fix

## Current Issue
The deployment is failing because Render is trying to run `dist/index.js` instead of `dist/index.prod.js`.

## Quick Fix Options

### Option 1: Update render.yaml (Recommended)
Make sure your render.yaml file has this exact content:

```yaml
services:
  # Backend API Service
  - type: web
    name: jpk-wilayah-timur-api
    runtime: node
    buildCommand: ./build-server.sh
    startCommand: NODE_ENV=production node dist/index.prod.js
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: NODE_ENV
        value: production
    healthCheckPath: /api/reviews/stats

  # Frontend Static Site
  - type: web
    name: jpk-wilayah-timur-frontend
    runtime: static
    buildCommand: ./build-client.sh
    staticPublishPath: ./dist/public
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: jpk-wilayah-timur-api
          property: host
```

### Option 2: Manual Service Configuration
If the Blueprint approach isn't working, deploy manually:

1. **Backend Service:**
   - Build Command: `./build-server.sh`
   - Start Command: `NODE_ENV=production node dist/index.prod.js`
   - Environment Variables:
     - `DATABASE_URL`: Your Neon connection string
     - `NODE_ENV`: `production`

2. **Frontend Service:**
   - Build Command: `./build-client.sh`
   - Publish Directory: `./dist/public`
   - Environment Variables:
     - `VITE_API_URL`: Your backend service URL

### Option 3: Alternative Build (If needed)
If you want to keep using `index.js`, update the build script:

```bash
# In build-server.sh, change the last line to:
esbuild server/index.prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js
```

## Steps to Fix

1. **Push the updated files to GitHub**
2. **Go to Render Dashboard**
3. **Delete the existing services** (if any)
4. **Create new Blueprint deployment** with updated render.yaml
5. **Or create manual services** with the correct commands above

## Files to Commit
- `server/index.prod.ts` (new production-safe server)
- `build-server.sh` (updated build command)
- `render.yaml` (updated start command)
- `RENDER_FIX.md` (this file)

The key fix is using the production-safe server entry point that doesn't import Replit dependencies!