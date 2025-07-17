# Frontend Approval Issue Fix

## Problem
When clicking "approve" on the frontend, it shows "review update" but nothing actually happens. The backend logs show only GET requests with 304 status codes, but no PATCH requests for updating review status.

## Root Cause
The issue was in `client/src/components/admin-table.tsx` where a local `apiRequest` function was being used instead of the one from `@/lib/queryClient`. This local function:

1. **Missing API URL prefix**: It was making requests to relative URLs like `/api/reviews/5/status` instead of the full backend URL
2. **Wrong response handling**: It was trying to parse JSON directly instead of handling the Response object properly

## Solution Applied
1. **Removed the local `apiRequest` function** from `admin-table.tsx`
2. **Imported the proper `apiRequest`** from `@/lib/queryClient` which handles:
   - API URL prefix using `VITE_API_URL` environment variable
   - Proper error handling
   - Credentials and headers
3. **Updated the mutation function** to properly handle the Response object returned by the apiRequest

## Changes Made
```diff
// In client/src/components/admin-table.tsx

// Added import
import { apiRequest } from "@/lib/queryClient";

// Removed local apiRequest function
- async function apiRequest(method: string, url: string, data?: any) {
-   const response = await fetch(url, {
-     method,
-     headers: data ? { "Content-Type": "application/json" } : {},
-     body: data ? JSON.stringify(data) : undefined,
-   });
-   // ... rest of local implementation
- }

// Updated mutation function
  const updateStatusMutation = useMutation({
-   mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" }) =>
-     apiRequest("PATCH", `/api/reviews/${id}/status`, { status }),
+   mutationFn: async ({ id, status }: { id: number; status: "approved" | "rejected" }) => {
+     const response = await apiRequest("PATCH", `/api/reviews/${id}/status`, { status });
+     return response.json();
+   },
```

## Expected Result
After this fix:
1. Clicking "approve" on frontend should send PATCH requests to the backend
2. Backend logs should show PATCH requests instead of just GET requests
3. Review status should actually update in the database
4. Frontend should refresh and show the updated status

## Deployment
Since both services are deployed on Render:
- Backend: Web service (jpk-wilayah-timur-api)
- Frontend: Static site (jpk-wilayah-timur-frontend)

The `VITE_API_URL` environment variable is automatically set from the backend service host, so the frontend should correctly communicate with the backend API.

## Testing
1. Navigate to the admin interface
2. Find a pending review
3. Click the "approve" button
4. Verify that the review status changes and the backend logs show PATCH requests