import { api, apiClient } from '@/lib/api';
import { withAuth } from '@/lib/auth-headers';

// Define the Assignment interface
export interface Assignment {
  id: number;
  equipment_id: number;
  flight_id: number;
  gate_id: number;
  assigned_to: number;
  status: string; // 'pending', 'in_progress', 'completed', 'cancelled'
  task_type: string;
  priority: string; // 'high', 'medium', 'low'
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  check_in_time?: string; // ISO date string, optional
  return_time?: string; // ISO date string, optional
  actual_start_time?: string; // ISO date string, optional
  actual_end_time?: string; // ISO date string, optional
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Interface for creating a new assignment
export interface CreateAssignmentPayload {
  equipment_id: number;
  flight_id: number;
  gate_id: number;
  assigned_to: number;
  status?: string; // Optional, defaults to 'pending'
  task_type: string;
  priority: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
}

// Interface for updating an assignment
export interface UpdateAssignmentPayload {
  equipment_id?: number;
  flight_id?: number;
  gate_id?: number;
  assigned_to?: number;
  status?: string;
  task_type?: string;
  priority?: string;
  start_time?: string; // ISO date string
  end_time?: string; // ISO date string
  check_in_time?: string; // ISO date string
  return_time?: string; // ISO date string
  actual_start_time?: string; // ISO date string
  actual_end_time?: string; // ISO date string
}

// Interface for assignment list response
export interface AssignmentListResponse {
  items: Assignment[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Interface for assignment list parameters
export interface AssignmentListParams {
  page?: number;
  page_size?: number;
  status?: string;
  equipment_id?: number;
  assigned_to?: number;
  flight_id?: number;
  gate_id?: number;
  task_type?: string;
  priority?: string;
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API endpoints
const ENDPOINTS = {
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_COUNTS: '/admin-portal/assignments/counts',
  ASSIGNMENT_LIST: '/admin-portal/assignments/list',
};

// Assignment service with CRUD operations
export const assignmentService = {
  // Get assignment counts
  getCounts: () => 
    api.get<{
      all: number;
      pending: number;
      in_progress: number;
      completed: number;
      cancelled: number;
    }>(ENDPOINTS.ASSIGNMENT_COUNTS),

  // Get paginated list of assignments with filters
  getList: (params: AssignmentListParams = {}) =>
    api.get<AssignmentListResponse>(ENDPOINTS.ASSIGNMENT_LIST, { params }),

  // Get all assignments
  getAll: () => 
    api.get<Assignment[]>(ENDPOINTS.ASSIGNMENTS),

  // Get assignment by ID
  getById: (id: number) => 
    api.get<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}`),

  // Create new assignment
  create: (assignment: CreateAssignmentPayload) =>
    api.post<Assignment>(ENDPOINTS.ASSIGNMENTS, assignment),

  // Update assignment
  update: (id: number, assignment: UpdateAssignmentPayload) =>
    api.put<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}`, assignment),

  // Delete assignment
  delete: (id: number) =>
    api.delete<void>(`${ENDPOINTS.ASSIGNMENTS}/${id}`),

  // Check in for an assignment
  checkIn: (id: number) =>
    api.post<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}/check-in`, {
      check_in_time: new Date().toISOString()
    }),

  // Start an assignment
  start: (id: number) =>
    api.post<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}/start`, {
      actual_start_time: new Date().toISOString(),
      status: 'in_progress'
    }),

  // Complete an assignment
  complete: (id: number) =>
    api.post<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}/complete`, {
      actual_end_time: new Date().toISOString(),
      status: 'completed'
    }),

  // Return equipment for an assignment
  returnEquipment: (id: number) =>
    api.post<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}/return`, {
      return_time: new Date().toISOString()
    }),

  // Cancel an assignment
  cancel: (id: number) =>
    api.post<Assignment>(`${ENDPOINTS.ASSIGNMENTS}/${id}/cancel`, {
      status: 'cancelled'
    }),

  // Search assignments with filters
  search: (params: Record<string, any>) =>
    api.get<Assignment[]>(ENDPOINTS.ASSIGNMENTS, { params }),
};
