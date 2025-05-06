import { api, apiClient } from '@/lib/api';
import { withAuth } from '@/lib/auth-headers';

// Define the Equipment interface
// export interface Equipment {
//   id: string;
//   type: string;
//   category: string;
//   code: string;
//   powerType: string;
//   aircraftCompatibility: string;
//   location: { lat: number; lng: number };
//   distance: string;
//   status: string;
//   lastUsed: string;
//   certificationRequired: string;
// }

export interface Equipment {
  id: number;
  equipment_type_id: number;
  serial_number: string;
  manufacturer: string;
  model: string;
  year_manufactured: number;
  purchase_date: string; // ISO date string
  last_maintenance_date: string; // ISO date string
  next_maintenance_date: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}


// API endpoints
const ENDPOINTS = {
  EQUIPMENT: '/equipments',
  RESTRICTED: '/equipments/restricted',
};

// Equipment service with CRUD operations
export const equipmentService = {
  // Get all equipment
  getAll: () => api.get<Equipment[]>(ENDPOINTS.EQUIPMENT),

  // Get equipment by ID
  getById: (id: string) => api.get<Equipment>(`${ENDPOINTS.EQUIPMENT}/${id}`),

  // Create new equipment
  create: (equipment: Omit<Equipment, 'id'>) =>
    api.post<Equipment>(ENDPOINTS.EQUIPMENT, equipment),

  // Update equipment
  update: (id: string, equipment: Partial<Equipment>) =>
    api.put<Equipment>(`${ENDPOINTS.EQUIPMENT}/${id}`, equipment),

  // Delete equipment
  delete: (id: string) =>
    api.delete<void>(`${ENDPOINTS.EQUIPMENT}/${id}`),

  // Search equipment with filters
  search: (params: Record<string, any>) =>
    api.get<Equipment[]>(ENDPOINTS.EQUIPMENT, { params }),

  // Example of explicitly adding auth headers to a specific request
  // This is useful for endpoints that require authentication but might
  // bypass the interceptor for some reason
  getRestrictedEquipment: () =>
    apiClient.get<Equipment[]>(ENDPOINTS.RESTRICTED, withAuth()),

  // Example of using auth headers with a third-party API
  importFromExternalSystem: (externalSystemId: string, apiKey: string) => {
    // Create config with both auth token and additional headers
    const config = withAuth({
      headers: {
        'X-External-API-Key': apiKey,
        'X-System-ID': externalSystemId
      }
    });

    return apiClient.post<{ imported: number }>('/import/external', {}, config);
  }
};
