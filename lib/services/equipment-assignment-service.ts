import { api, apiClient } from '@/lib/api';
import { withAuth } from '@/lib/auth-headers';

// Define interfaces for the API responses
export interface AssignmentCounts {
  all: number;
  scheduled: number;
  active: number;
  completed: number;
  cancelled?: number;
}

export interface EquipmentDetails {
  id: number;
  serial_number: string;
  model: string;
  manufacturer: string;
  type_name: string;
  equipment_class: string;
  is_powered: boolean;
  name: string;
}

export interface OperatorDetails {
  id: number;
  username: string;
  email: string;
}

export interface AssignmentListItem {
  id: number;
  equipment_id: number;
  equipment: EquipmentDetails;
  operator: OperatorDetails;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  start_time: string | null;
  end_time: string | null;
  check_in_time: string | null;
  return_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  task_type: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentListResponse {
  items: AssignmentListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AssignmentListParams {
  page?: number;
  page_size?: number;
  assignment_id?: number;
  username?: string;
  equipment_id?: number;
  equipment_name?: string;
  start_time_from?: string;
  start_time_to?: string;
  end_time_from?: string;
  end_time_to?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateAssignmentPayload {
  equipment_id: number;
  assigned_to: number;
  task_type: string;
  priority: string;
  start_time: string;
  end_time: string;
  status?: string;
}

export interface UpdateAssignmentPayload {
  equipment_id?: number;
  assigned_to?: number;
  task_type?: string;
  priority?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  check_in_time?: string;
  return_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
}

// API endpoints
const ENDPOINTS = {
  COUNTS: '/admin-portal/equipment-assignments/counts',
  LIST: '/admin-portal/equipment-assignments/operator-assignments/list',
  ASSIGNMENTS: '/admin-portal/equipment-assignments',
};

// Equipment assignment service
export const equipmentAssignmentService = {
  // Get assignment counts by status
  getCounts: () =>
    api.get<AssignmentCounts>(ENDPOINTS.COUNTS),

  // Get assignment list with pagination and filters
  getList: (params: AssignmentListParams = {}) =>
    api.get<AssignmentListResponse>(ENDPOINTS.LIST, { params }),
    
  // Get all assignments
  getAll: () => 
    api.get<AssignmentListItem[]>(ENDPOINTS.ASSIGNMENTS),
    
  // // Get assignment by ID
  // getById: (id: number) => 
  //   api.get<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}`),
    
  // // Create new assignment
  // create: (assignment: CreateAssignmentPayload) =>
  //   api.post<AssignmentListItem>(ENDPOINTS.ASSIGNMENTS, assignment),
    
  // // Update assignment
  // update: (id: number, assignment: UpdateAssignmentPayload) =>
  //   api.put<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}`, assignment),
    
  // // Delete assignment
  // delete: (id: number) =>
  //   api.delete<void>(`${ENDPOINTS.ASSIGNMENTS}/${id}`),
    
  // // Check in for an assignment
  // checkIn: (id: number) =>
  //   api.post<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}/check-in`, {
  //     check_in_time: new Date().toISOString()
  //   }),
    
  // // Start an assignment
  // start: (id: number) =>
  //   api.post<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}/start`, {
  //     actual_start_time: new Date().toISOString(),
  //     status: 'active'
  //   }),
    
  // // Complete an assignment
  // complete: (id: number) =>
  //   api.post<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}/complete`, {
  //     actual_end_time: new Date().toISOString(),
  //     status: 'completed'
  //   }),
    
  // // Return equipment for an assignment
  // returnEquipment: (id: number) =>
  //   api.post<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}/return`, {
  //     return_time: new Date().toISOString()
  //   }),
    
  // // Cancel an assignment
  // cancel: (id: number) =>
  //   api.post<AssignmentListItem>(`${ENDPOINTS.ASSIGNMENTS}/${id}/cancel`, {
  //     status: 'cancelled'
  //   }),
    
  // // Search assignments with filters
  // search: (params: Record<string, any>) =>
  //   api.get<AssignmentListItem[]>(ENDPOINTS.ASSIGNMENTS, { params }),
    
  // // Get assignments for a specific operator
  // getByOperator: (operatorId: number, params: Omit<AssignmentListParams, 'username'> = {}) =>
  //   api.get<AssignmentListResponse>(`${ENDPOINTS.ASSIGNMENTS}/operator/${operatorId}`, { 
  //     params 
  //   }),
    
  // // Get assignments for a specific equipment
  // getByEquipment: (equipmentId: number, params: Omit<AssignmentListParams, 'equipment_id'> = {}) =>
  //   api.get<AssignmentListResponse>(`${ENDPOINTS.ASSIGNMENTS}/equipment/${equipmentId}`, { 
  //     params 
  //   }),
    
  // // Get current active assignments
  // getActiveAssignments: (params: Omit<AssignmentListParams, 'status'> = {}) =>
  //   api.get<AssignmentListResponse>(`${ENDPOINTS.ASSIGNMENTS}/active`, { 
  //     params 
  //   }),
};
