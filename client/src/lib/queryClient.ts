import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { api, ApiError } from "./api";

export { ApiError };

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const result = await api[method.toLowerCase() as keyof typeof api](url, data);
  
  // Return a mock Response object for compatibility
  return {
    ok: true,
    status: 200,
    json: async () => result,
    text: async () => typeof result === 'string' ? result : JSON.stringify(result),
  } as Response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      return await api.get(queryKey.join(""));
    } catch (error) {
      if (error instanceof ApiError) {
        if (unauthorizedBehavior === "returnNull" && error.status === 401) {
          return null;
        }
        throw error;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: false, // Don't retry mutations
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
