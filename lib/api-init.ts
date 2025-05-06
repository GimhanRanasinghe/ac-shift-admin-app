import { updateBaseUrl, getBaseUrl } from './api';

/**
 * Initialize the API configuration from localStorage if available
 * This should be called on app startup
 */
export function initializeApi(): void {
  if (typeof window !== 'undefined') {
    try {
      // Try to get the base URL from localStorage
      const savedBaseUrl = localStorage.getItem('api-base-url');
      
      if (savedBaseUrl) {
        // Update the base URL in the API client
        updateBaseUrl(savedBaseUrl);
        console.log('API base URL initialized from localStorage:', savedBaseUrl);
      } else {
        // If not found in localStorage, use the default from environment variables
        const defaultBaseUrl = getBaseUrl();
        console.log('Using default API base URL:', defaultBaseUrl);
      }
    } catch (error) {
      console.error('Error initializing API configuration:', error);
    }
  }
}
