const API_BASE_URL = import.meta.env.VITE_API_URL || "https://jpkwt-rating-reviews.onrender.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    let errorMessage = `${response.status}: ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    
    throw new ApiError(errorMessage, response.status);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      0
    );
  }
}

// Convenience methods
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint: string, data?: any) => 
    apiRequest(endpoint, { 
      method: "POST", 
      body: data ? JSON.stringify(data) : undefined 
    }),
  patch: (endpoint: string, data?: any) => 
    apiRequest(endpoint, { 
      method: "PATCH", 
      body: data ? JSON.stringify(data) : undefined 
    }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: "DELETE" }),
};

// Keep-alive function for Render free tier
export function keepAlive() {
  // Ping the backend every 10 minutes to prevent it from sleeping
  setInterval(async () => {
    try {
      await api.get("/api/health");
    } catch (error) {
      console.warn("Keep-alive ping failed:", error);
    }
  }, 10 * 60 * 1000); // 10 minutes
}

export default api;