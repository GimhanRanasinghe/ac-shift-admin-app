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

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    // For example:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
        // You could redirect to login page or refresh token
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
