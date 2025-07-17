# Review Management System

## Overview

This is a full-stack review management system built with React, TypeScript, Express, and Drizzle ORM. The application allows users to submit reviews with ratings and provides an admin dashboard for managing review approvals. The system uses a modern tech stack with shadcn/ui components and Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for request/response validation
- **Development**: ESM modules with tsx for TypeScript execution
- **Production**: Bundled with esbuild for deployment

### Database Layer
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM with neon-http driver
- **Migrations**: Drizzle Kit for schema migrations
- **Schema**: Single reviews table with status management
- **Connection**: Persistent connection using DATABASE_URL environment variable

## Key Components

### Data Models
- **Reviews Table**: Stores user reviews with fields for name, email, phone, rating (1-5), review text, status (pending/approved/rejected), and submission timestamp
- **Status Workflow**: Reviews start as "pending" and can be approved or rejected by admins

### Frontend Components
- **Navigation**: Sticky header with routing between public and admin views
- **Review Form**: Validated form for submitting new reviews with star rating
- **Review Card**: Display component for approved reviews with user initials and formatted dates
- **Admin Dashboard**: Stats overview and management table with bulk actions
- **Star Rating**: Interactive rating component with hover states

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **API Routes**: RESTful endpoints for CRUD operations on reviews
- **Middleware**: Request logging and error handling

## Data Flow

1. **Review Submission**: Users fill out the review form → validates with Zod → saves to database with "pending" status
2. **Admin Review**: Admins view all reviews → can approve/reject → updates database status
3. **Public Display**: Only approved reviews are shown on the public homepage
4. **Real-time Updates**: TanStack Query handles cache invalidation and refetching

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components for accessibility
- **drizzle-orm**: Type-safe database ORM
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **wouter**: Lightweight routing
- **dotenv**: Environment variable management

### Development Tools
- **Vite**: Build tool with HMR and optimization
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting
- **Tailwind CSS**: Utility-first styling
- **esbuild**: Server bundling for production

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations run via `db:push` script

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with hot reload
- **Production**: Bundled Node.js application with static file serving
- **Database**: Uses Neon PostgreSQL with `DATABASE_URL` environment variable

### Render Deployment
- **Backend Service**: Node.js web service with health checks
- **Frontend Service**: Static site deployment
- **Database**: Neon PostgreSQL (external service)
- **Environment Variables**: Configured in Render dashboard

### File Structure
- `client/`: React frontend application
- `server/`: Express backend with API routes
- `shared/`: Common schemas and types
- `build-client.sh`: Frontend build script for Render
- `build-server.sh`: Backend build script for Render
- `render.yaml`: Deployment configuration for Render

The application follows a monorepo structure with clear separation between frontend, backend, and shared code. The database schema is centralized in the shared directory for consistency across the stack.