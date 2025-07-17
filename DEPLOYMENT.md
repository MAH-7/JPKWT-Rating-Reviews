# Deployment Guide - JPK Wilayah Timur Reviews

## Quick Start Guide

### 1. Push to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - JPK Wilayah Timur Reviews"

# Set main branch
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy on Render

#### Option A: Blueprint Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file automatically
5. Set environment variables:
   - `DATABASE_URL`: Your Neon database connection string
6. Click **"Deploy"**

#### Option B: Manual Deployment
1. **Deploy Backend API:**
   - New → Web Service
   - Connect GitHub repository
   - **Build Command**: `./build-server.sh`
   - **Start Command**: `NODE_ENV=production node dist/index.js`
   - **Environment Variables**:
     - `DATABASE_URL`: Your Neon connection string
     - `NODE_ENV`: `production`

2. **Deploy Frontend:**
   - New → Static Site
   - Connect GitHub repository
   - **Build Command**: `./build-client.sh`
   - **Publish Directory**: `./dist/public`
   - **Environment Variables**:
     - `VITE_API_URL`: Your backend service URL

## Environment Variables

### Required for Backend
```
DATABASE_URL=postgresql://neondb_owner:password@endpoint/neondb?sslmode=require
NODE_ENV=production
```

### Required for Frontend
```
VITE_API_URL=https://your-backend-service.onrender.com
```

## Troubleshooting

### Build Issues
- Ensure build scripts are executable: `chmod +x build-*.sh`
- Check Node.js version compatibility
- Verify all dependencies are installed

### Fixed: Replit Dependencies Issue
If you encounter "Cannot find package '@replit/vite-plugin-runtime-error-modal'" error:
- The project now uses `server/index.prod.ts` for production builds
- This avoids importing Replit-specific dependencies that don't exist in Render
- The build scripts automatically use the production-safe version

### Database Issues
- Verify DATABASE_URL is correct
- Ensure Neon database is accessible
- Check database schema is pushed: `npm run db:push`

### Connection Issues
- Verify VITE_API_URL points to correct backend
- Check CORS settings if needed
- Ensure both services are running

## Post-Deployment

1. **Test the application**: Visit your frontend URL
2. **Submit a review**: Test the review form
3. **Check admin dashboard**: Visit `/admin` to manage reviews
4. **Verify database**: Check Neon console for data

## Free Tier Limitations

### Render Free Tier
- Services sleep after 15 minutes of inactivity
- 750 hours per month per service
- Cold start delay when waking up

### Neon Free Tier
- 1 database
- 10 GB storage
- 1 compute unit

## Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test database connection
4. Check build logs for errors

Your application is now ready for production deployment!