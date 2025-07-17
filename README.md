# JPK Wilayah Timur Reviews

A workplace rating and review system built with React, TypeScript, Express, and Drizzle ORM using Neon PostgreSQL database.

## Features

- ✅ Public review submission with star ratings (1-5)
- ✅ Admin dashboard for review management
- ✅ Review approval/rejection system
- ✅ Analytics and reporting
- ✅ Search and filtering capabilities
- ✅ Real-time statistics
- ✅ Responsive design with shadcn/ui components
- ✅ Persistent PostgreSQL database with Neon

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- shadcn/ui components
- Tailwind CSS
- TanStack Query for data fetching
- Wouter for routing

### Backend
- Express.js with TypeScript
- Drizzle ORM with PostgreSQL
- Neon Database (serverless PostgreSQL)
- Zod for validation

## Deployment to Render

### Prerequisites
1. [Render](https://render.com) account
2. [Neon](https://neon.tech) database (free tier available)
3. This repository pushed to GitHub

### Database Setup
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Copy your database connection string
3. Set up the database schema:
   ```bash
   DATABASE_URL='your-neon-connection-string' npm run db:push
   ```

### Deployment Steps

#### Option 1: Using render.yaml (Recommended)
1. Fork/clone this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Set the following environment variables:
   - `DATABASE_URL`: Your Neon database connection string
6. Deploy both services

#### Option 2: Manual Setup
1. **Deploy Backend API:**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set:
     - **Build Command**: `./build-server.sh`
     - **Start Command**: `NODE_ENV=production node dist/index.js`
     - **Environment Variables**:
       - `DATABASE_URL`: Your Neon database connection string
       - `NODE_ENV`: `production`
   - Deploy

2. **Deploy Frontend:**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Set:
     - **Build Command**: `./build-client.sh`
     - **Publish Directory**: `./dist/public`
     - **Environment Variables**:
       - `VITE_API_URL`: Your backend service URL (e.g., `https://your-api.onrender.com`)
   - Deploy

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=production
```

#### Frontend 
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public
- `GET /api/reviews/approved` - Get approved reviews
- `POST /api/reviews` - Submit new review
- `GET /api/reviews/stats` - Get review statistics

### Admin
- `GET /api/reviews` - Get all reviews
- `PATCH /api/reviews/:id/status` - Update review status
- `GET /api/reviews/search?q=query` - Search reviews
- `GET /api/reviews/filter?status=pending&rating=5` - Filter reviews

## Database Schema

### Reviews Table
- `id` - Primary key
- `name` - Reviewer name
- `email` - Reviewer email
- `phone` - Reviewer phone
- `rating` - Star rating (1-5)
- `review` - Review text
- `status` - Review status (pending, approved, rejected)
- `submittedAt` - Submission timestamp

## Admin Dashboard

Access the admin dashboard at `/admin` to:
- View all reviews and their status
- Approve or reject pending reviews
- View analytics and statistics
- Search and filter reviews
- Export data (placeholder for future implementation)

## Free Tier Limitations

### Render Free Tier
- Web services sleep after 15 minutes of inactivity
- 750 hours per month
- Custom domains not included

### Neon Free Tier
- 1 database
- 10 GB storage
- 1 compute unit

## Support

For issues or questions:
1. Check the logs in Render Dashboard
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Check that all dependencies are installed

## License

MIT License