/**
 * API Client
 * 
 * This file provides utility functions for making API requests.
 * It uses the API configuration from api-config.ts.
 */

import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './api-config';

// Types
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

/**
 * Handles API request timeouts
 */
const timeoutPromise = (ms: number): Promise<Response> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Makes an API request with the given options
 */
export async function apiRequest<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const timeout = options.timeout || REQUEST_TIMEOUT;
    
    const headers = {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      ...options,
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(url, requestOptions),
      timeoutPromise(timeout),
    ]) as Response;

    const responseData = await response.json();

    return {
      data: response.ok ? responseData : null,
      error: response.ok ? null : new Error(responseData.message || 'An error occurred'),
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('An unknown error occurred'),
      status: 0,
    };
  }
}

/**
 * Convenience methods for common API operations
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, 'GET', undefined, options);
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, 'POST', data, options);
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, 'PUT', data, options);
  },

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, 'PATCH', data, options);
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, 'DELETE', undefined, options);
  },
};

export default api;
