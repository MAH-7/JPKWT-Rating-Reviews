# SPA Routing Fix for Admin Dashboard

## Problem
When navigating to the admin dashboard via the navigation menu, it works fine. However, when refreshing the page at `/admin` route, it shows a "Not Found" error.

## Root Cause
This is a common issue with Single Page Applications (SPAs) deployed as static sites:

1. **Client-side routing**: React Router (or Wouter in this case) handles routing on the client side
2. **Server behavior**: When you refresh the page at `/admin`, the server looks for a file at that path
3. **Missing file**: Since `/admin` doesn't exist as a physical file, the server returns a 404 error
4. **Static hosting**: Render static sites don't automatically handle SPA routing

## Solution Applied
Created a `_redirects` file in the `client/public/` directory to configure the static site server to serve `index.html` for all routes.

### File Created: `client/public/_redirects`
```
/*    /index.html   200
```

This tells Render's static site hosting:
- For any path (`/*`) that doesn't match an existing file
- Serve the `index.html` file instead
- Return a 200 status code (not a redirect)

## How It Works
1. User navigates to `/admin` directly or refreshes the page
2. Server doesn't find a physical file at `/admin`
3. The `_redirects` rule catches this and serves `index.html`
4. React loads and Wouter router takes over
5. Client-side routing displays the correct component for `/admin`

## Vite Configuration
The `_redirects` file is automatically copied from `client/public/` to the build output (`dist/public/`) during the build process, so no additional Vite configuration is needed.

## Testing
1. Deploy the updated frontend to Render
2. Navigate to your admin dashboard normally (should work as before)
3. Refresh the page while on `/admin` route
4. The page should reload correctly instead of showing "Not Found"

## Alternative Solutions
If the `_redirects` file doesn't work, other options include:
- Using `netlify.toml` with redirect rules
- Configuring server-side routing (not applicable for static sites)
- Using hash routing instead of browser routing (less ideal for UX)

## Deployment
After pushing this change:
1. The frontend static site will rebuild automatically on Render
2. The `_redirects` file will be included in the build output
3. SPA routing should work correctly for all routes