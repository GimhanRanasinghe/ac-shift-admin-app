import { api } from '@/lib/api';

// Define interfaces for the API responses
export interface MaintenanceCounts {
  all: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

export interface EquipmentDetails {
  id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  type_name: string;
}

export interface MaintenanceTaskItem {
  id: number;
  equipment_id: number;
  equipment: EquipmentDetails;
  maintenance_type: string;
  status: string;
  category: string;
  due_date: string;
  assigned_to: number | null;
  priority: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceListResponse {
  items: MaintenanceTaskItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MaintenanceListParams {
  page?: number;
  page_size?: number;
  type?: string;
  equipment_id?: number;
  status?: string;
  priority?: string;
  assigned_to?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API endpoints
const ENDPOINTS = {
  COUNTS: '/admin-portal/maintenance-tasks/counts',
  LIST: '/admin-portal/maintenance-tasks/list',
};

// Maintenance tasks service
export const maintenanceService = {
  // Get maintenance task counts by category
  getCounts: () =>
    api.get<MaintenanceCounts>(ENDPOINTS.COUNTS),

  // Get maintenance tasks list with pagination and filters
  getList: (params: MaintenanceListParams = {}) =>
    api.get<MaintenanceListResponse>(ENDPOINTS.LIST, { params }),
};
