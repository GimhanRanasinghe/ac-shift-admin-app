/**
 * API Configuration
 * 
 * This file contains the configuration for the API endpoints.
 * It provides a centralized place to manage the API base URL and other API-related settings.
 */

// API base URL from environment variables with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// API endpoints
export const API_ENDPOINTS = {
  // Equipment endpoints
  EQUIPMENT: {
    BASE: '/equipment',
    GET_ALL: '/equipment',
    GET_BY_ID: (id: string) => `/equipment/${id}`,
    CREATE: '/equipment',
    UPDATE: (id: string) => `/equipment/${id}`,
    DELETE: (id: string) => `/equipment/${id}`,
  },
  // Maintenance endpoints
  MAINTENANCE: {
    BASE: '/maintenance',
    GET_ALL: '/maintenance',
    GET_BY_ID: (id: string) => `/maintenance/${id}`,
    CREATE: '/maintenance',
    UPDATE: (id: string) => `/maintenance/${id}`,
    DELETE: (id: string) => `/maintenance/${id}`,
  },
  // User endpoints
  USERS: {
    BASE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Equipment types endpoints
  EQUIPMENT_TYPES: {
    BASE: '/equipment-types',
    GET_ALL: '/equipment-types',
    GET_BY_ID: (id: string) => `/equipment-types/${id}`,
    CREATE: '/equipment-types',
    UPDATE: (id: string) => `/equipment-types/${id}`,
    DELETE: (id: string) => `/equipment-types/${id}`,
  },
};

// API version
export const API_VERSION = 'v1';

// Default request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds
