import { api } from '@/lib/api';

// Define interfaces for the API responses
export interface EquipmentCounts {
  total: number;
  available: number;
  in_use: number;
  maintenance: number;
  decommissioned?: number;
}

export interface EquipmentType {
  id: number;
  name: string;
  count: number;
}

export interface EquipmentTypeResponse {
  types: EquipmentType[];
}

export interface EquipmentListItem {
  id: number;
  serial_number: string;
  equipment_type: {
    id: number;
    name: string;
  };
  status: 'available' | 'in_use' | 'maintenance' | 'decommissioned';
  category: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  location: string;
  distance?: string;
}

export interface EquipmentListResponse {
  equipment: EquipmentListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface EquipmentListParams {
  page?: number;
  limit?: number;
  status?: string;
  type_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  maintenance_date_from?: string;
  maintenance_date_to?: string;
}

// API endpoints
const ENDPOINTS = {
  COUNTS: '/admin-portal/equipment-inventory/counts',
  TYPES: '/admin-portal/equipment-inventory/types',
  LIST: '/admin-portal/equipment-inventory/list',
};

// Equipment inventory service
export const equipmentInventoryService = {
  // Get equipment counts by status
  getCounts: () => 
    api.get<EquipmentCounts>(ENDPOINTS.COUNTS),
  
  // Get equipment types with counts
  getTypes: () => 
    api.get<EquipmentTypeResponse>(ENDPOINTS.TYPES),
  
  // Get equipment list with pagination and filters
  getList: (params: EquipmentListParams = {}) => 
    api.get<EquipmentListResponse>(ENDPOINTS.LIST, { params }),
};
