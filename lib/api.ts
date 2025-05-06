import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a base API configuration
const apiConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create an Axios instance with the configuration
const apiClient: AxiosInstance = axios.create(apiConfig);

// Token management functions
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setAuthToken = (token: string | null): void => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
};

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized, 403 Forbidden)
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access. Please log in again.');

        // Clear the invalid token
        setAuthToken(null);

        // Redirect to login page if in browser environment
        if (typeof window !== 'undefined') {
          // You can use Next.js router programmatically if needed
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        // Handle forbidden access
        console.error('You do not have permission to access this resource.');
      }
    }

    return Promise.reject(error);
  }
);

// Generic API request function
const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
};

// Utility functions for common HTTP methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>('GET', url, undefined, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>('POST', url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>('PUT', url, data, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>('PATCH', url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>('DELETE', url, undefined, config),
};

// Export the Axios instance for direct use if needed
export { apiClient };

// Export the base URL for reference
export const getBaseUrl = (): string => apiConfig.baseURL as string;

// Export a function to update the base URL if needed
export const updateBaseUrl = (newBaseUrl: string): void => {
  apiConfig.baseURL = newBaseUrl;
  apiClient.defaults.baseURL = newBaseUrl;
};
