import { api } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/api';

// Define interfaces for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// API endpoints
const ENDPOINTS = {
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  REFRESH: '/users/refresh',
  ME: '/users/me',
};

// Authentication service
export const authService = {
  // Login user and store token
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
    
    // Store the token
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },
  
  // Logout user and remove token
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if your API requires it
      await api.post<void>(ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear the token regardless of API call success
      setAuthToken(null);
    }
  },
  
  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>(ENDPOINTS.ME);
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
  
  // Refresh the authentication token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>(ENDPOINTS.REFRESH);
    
    // Update the token
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },
};
