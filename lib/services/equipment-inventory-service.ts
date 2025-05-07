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
}

export interface EquipmentTypeResponse {
  types: EquipmentType[];
}

export interface EquipmentListItem {
  id: number;
  equipment_type_id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  year_manufactured: number;
  purchase_date: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  type_name: string | null;
  equipment_class: string | null;
  is_powered: number | null;
  created_at: string;
  updated_at: string;
  status?: 'available' | 'in_use' | 'maintenance' | 'decommissioned';
  category?: string;
  location?: string;
  distance?: string;
}

export interface EquipmentListResponse {
  items: EquipmentListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface EquipmentListParams {
  page?: number;
  page_size?: number;
  status?: 'available' | 'in-use' | 'maintenance';
  equipment_type_id?: number;
  last_maintenance_from?: string;
  last_maintenance_to?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
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
