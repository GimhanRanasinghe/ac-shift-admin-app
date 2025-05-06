/**
 * Equipment Service
 * 
 * This service handles API requests related to equipment.
 */

import api from '../api-client';
import { API_ENDPOINTS } from '../api-config';

// Types
interface Equipment {
  id: string;
  type: string;
  category: string;
  code: string;
  powerType: string;
  aircraftCompatibility: string;
  location: { lat: number; lng: number };
  distance: string;
  status: string;
  lastUsed: string;
  fuelLevel?: string | null;
  batteryLevel?: string | null;
  lastMaintenance: string;
  nextMaintenance: string;
  certificationRequired: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  year?: string;
  description?: string;
  sensors?: {
    telematicsDevice?: boolean;
    telematicsSerial?: string;
    bleBeacon?: boolean;
    bleSerial?: string;
    levelSensor?: boolean;
    levelSensorSerial?: string;
    tempSensor?: boolean;
    tempSensorSerial?: string;
    aiDashcam?: boolean;
    aiDashcamSerial?: string;
    cameras?: boolean;
    camerasSerial?: string;
  };
}

/**
 * Equipment Service
 */
export const EquipmentService = {
  /**
   * Get all equipment
   */
  getAllEquipment: async (): Promise<Equipment[]> => {
    const response = await api.get<Equipment[]>(API_ENDPOINTS.EQUIPMENT.GET_ALL);
    
    if (response.error) {
      console.error('Error fetching equipment:', response.error);
      throw response.error;
    }
    
    return response.data || [];
  },

  /**
   * Get equipment by ID
   */
  getEquipmentById: async (id: string): Promise<Equipment | null> => {
    const response = await api.get<Equipment>(API_ENDPOINTS.EQUIPMENT.GET_BY_ID(id));
    
    if (response.error) {
      console.error(`Error fetching equipment with ID ${id}:`, response.error);
      throw response.error;
    }
    
    return response.data;
  },

  /**
   * Create new equipment
   */
  createEquipment: async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
    const response = await api.post<Equipment>(API_ENDPOINTS.EQUIPMENT.CREATE, equipment);
    
    if (response.error) {
      console.error('Error creating equipment:', response.error);
      throw response.error;
    }
    
    return response.data as Equipment;
  },

  /**
   * Update equipment
   */
  updateEquipment: async (id: string, updates: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put<Equipment>(API_ENDPOINTS.EQUIPMENT.UPDATE(id), updates);
    
    if (response.error) {
      console.error(`Error updating equipment with ID ${id}:`, response.error);
      throw response.error;
    }
    
    return response.data as Equipment;
  },

  /**
   * Delete equipment
   */
  deleteEquipment: async (id: string): Promise<boolean> => {
    const response = await api.delete(API_ENDPOINTS.EQUIPMENT.DELETE(id));
    
    if (response.error) {
      console.error(`Error deleting equipment with ID ${id}:`, response.error);
      throw response.error;
    }
    
    return true;
  },
};

export default EquipmentService;
