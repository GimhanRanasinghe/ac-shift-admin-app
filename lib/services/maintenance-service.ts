import { api, apiClient } from '@/lib/api';
import { withAuth } from '@/lib/auth-headers';

// Define interfaces for the API responses
export interface MaintenanceCounts {
  all: number;
  upcoming: number;
  unassigned: number;
  started: number;
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
  description?: string;
  notes?: string;
  completion_date?: string;
  parts_used?: string[];
  labor_hours?: number;
  cost?: number;
}

export interface CreateMaintenanceTaskPayload {
  equipment_id: number;
  maintenance_type: string;
  status?: string;
  priority: string;
  type: string;
  due_date: string;
  assigned_to?: number | null;
  description?: string;
  notes?: string;
}

export interface UpdateMaintenanceTaskPayload {
  equipment_id?: number;
  maintenance_type?: string;
  status?: string;
  priority?: string;
  type?: string;
  due_date?: string;
  assigned_to?: number | null;
  description?: string;
  notes?: string;
  completion_date?: string;
  parts_used?: string[];
  labor_hours?: number;
  cost?: number;
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
  TASKS: '/maintenances',
  // TYPES: '/admin-portal/maintenance-tasks/types',
};

export interface MaintenanceTypeResponse {
  types: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

// Maintenance tasks service
export const maintenanceService = {
  // Get maintenance task counts by category
  getCounts: () =>
    api.get<MaintenanceCounts>(ENDPOINTS.COUNTS),

  // Get maintenance tasks list with pagination and filters
  getList: (params: MaintenanceListParams = {}) =>
    api.get<MaintenanceListResponse>(ENDPOINTS.LIST, { params }),

  // Get maintenance types
  // getTypes: () =>
  //   api.get<MaintenanceTypeResponse>(ENDPOINTS.TYPES),

  // Get all maintenance tasks
  getAll: () =>
    api.get<MaintenanceTaskItem[]>(ENDPOINTS.TASKS),

  // Get maintenance task by ID
  getById: (id: number) =>
    api.get<MaintenanceTaskItem>(`${ENDPOINTS.TASKS}/${id}`),

  // Create new maintenance task
  create: (task: CreateMaintenanceTaskPayload) =>
    api.post<MaintenanceTaskItem>(ENDPOINTS.TASKS, task),

  // Update maintenance task
  update: (id: number, task: UpdateMaintenanceTaskPayload) =>
    api.put<MaintenanceTaskItem>(`${ENDPOINTS.TASKS}/${id}`, task),

  // Delete maintenance task
  delete: (id: number) =>
    api.delete<void>(`${ENDPOINTS.TASKS}/${id}`),

  // Complete a maintenance task
  complete: (id: number, completionData: {
    completion_date?: string;
    notes?: string;
    parts_used?: string[];
    labor_hours?: number;
    cost?: number;
  }) =>
    api.post<MaintenanceTaskItem>(`${ENDPOINTS.TASKS}/${id}/complete`, {
      status: 'completed',
      ...completionData,
    }),

  // Assign a maintenance task to a user
  assign: (id: number, userId: number) =>
    api.post<MaintenanceTaskItem>(`${ENDPOINTS.TASKS}/${id}/assign`, {
      assigned_to: userId
    }),

  // Reschedule a maintenance task
  reschedule: (id: number, newDueDate: string) =>
    api.post<MaintenanceTaskItem>(`${ENDPOINTS.TASKS}/${id}/reschedule`, {
      due_date: newDueDate
    }),

  // Search maintenance tasks with filters
  search: (params: Record<string, any>) =>
    api.get<MaintenanceTaskItem[]>(ENDPOINTS.TASKS, { params }),

  // Example of explicitly adding auth headers to a specific request
  getRestrictedMaintenanceTasks: () =>
    apiClient.get<MaintenanceTaskItem[]>(`${ENDPOINTS.TASKS}/restricted`, withAuth()),
};
