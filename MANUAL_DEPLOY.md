# Manual Render Deployment Guide

## Quick Deploy (Manual - Not Blueprint)

### Step 1: Create Web Service (Backend API)
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repo: `MAH-7/JPKWT-Rating-Reviews`
3. Configure:
   - **Name**: `jpk-wilayah-timur-api`
   - **Runtime**: Node
   - **Build Command**: `./build-server.sh`
   - **Start Command**: `NODE_ENV=production node dist/index.prod.js`
   - **Instance Type**: Free
4. Add Environment Variables:
   - `DATABASE_URL`: Your Neon database URL
   - `NODE_ENV`: `production`
5. Deploy!

**Note**: The backend is now API-only with CORS enabled. It doesn't serve static files since frontend is deployed separately.

### Step 2: Create Static Site (Frontend)
1. Go to Render Dashboard → New → Static Site
2. Connect same GitHub repo
3. Configure:
   - **Name**: `jpk-wilayah-timur-frontend`
   - **Build Command**: `npm install && ./build-client.sh`
   - **Publish Directory**: `./dist/public`
4. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL (from Step 1)
5. Deploy!

## Your Database URL
Use your Neon database URL:
```
postgresql://neondb_owner:npg_***@ep-still-surf-a1nktpks-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Free Tier Benefits
- ✅ Backend: 750 hours/month (free web service)
- ✅ Frontend: Unlimited (free static site)
- ✅ Database: Neon free tier (already set up)

## Build Commands Fix
The build scripts already include `npm install` so dependencies will be installed properly.

## Expected URLs
- Backend API: `https://jpk-wilayah-timur-api.onrender.com`
- Frontend: `https://jpk-wilayah-timur-frontend.onrender.com`