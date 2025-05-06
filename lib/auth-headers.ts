import { AxiosRequestConfig } from 'axios';
import { getAuthToken } from './api';

/**
 * Add authorization headers to a request config
 * This is useful when you need to explicitly add auth headers to a specific request
 * that might bypass the interceptor (like third-party API calls)
 */
export function withAuth(config: AxiosRequestConfig = {}): AxiosRequestConfig {
  const token = getAuthToken();
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

/**
 * Create headers object with authorization token
 * This is useful when you need just the headers object for fetch or other API calls
 */
export function createAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}
