# API Services

This directory contains service modules that handle API requests for different resources in the application.

## Overview

The services are built on top of the API client (`lib/api-client.ts`) which provides a consistent way to make API requests. The API client uses the configuration from `lib/api-config.ts` which centralizes API-related settings like the base URL.

## Available Services

- `equipment-service.ts`: Handles API requests related to equipment

## How to Use

### 1. Import the service

```typescript
import { EquipmentService } from '@/lib/services/equipment-service';
```

### 2. Call the service methods

```typescript
// Example: Get all equipment
try {
  const equipment = await EquipmentService.getAllEquipment();
  console.log('Equipment:', equipment);
} catch (error) {
  console.error('Error:', error);
}

// Example: Get equipment by ID
try {
  const equipment = await EquipmentService.getEquipmentById('BTG-1045');
  console.log('Equipment:', equipment);
} catch (error) {
  console.error('Error:', error);
}

// Example: Create new equipment
try {
  const newEquipment = await EquipmentService.createEquipment({
    type: 'Baggage Tractor',
    category: 'Powered Equipment',
    code: 'BTG',
    powerType: 'Powered (Open Fossil Fuel)',
    aircraftCompatibility: 'All',
    location: { lat: 43.6772, lng: -79.6306 },
    distance: '120m',
    status: 'Available',
    lastUsed: '2 hours ago',
    fuelLevel: '75%',
    batteryLevel: null,
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-06-15',
    certificationRequired: 'New Hire / Station Attendant Core'
  });
  console.log('New equipment created:', newEquipment);
} catch (error) {
  console.error('Error:', error);
}
```

## Creating a New Service

To create a new service for a different resource:

1. Create a new file in the `lib/services` directory (e.g., `user-service.ts`)
2. Import the API client and configuration
3. Define the resource types
4. Implement the service methods using the API client
5. Export the service

Example template:

```typescript
import api from '../api-client';
import { API_ENDPOINTS } from '../api-config';

// Define types
interface ResourceType {
  id: string;
  // Add other properties
}

export const NewService = {
  getAll: async (): Promise<ResourceType[]> => {
    const response = await api.get<ResourceType[]>(API_ENDPOINTS.RESOURCE.GET_ALL);
    
    if (response.error) {
      console.error('Error fetching resources:', response.error);
      throw response.error;
    }
    
    return response.data || [];
  },
  
  // Add other methods
};

export default NewService;
```

## Environment Variables

The API base URL is configured using environment variables. To change the API base URL:

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api
```

3. Restart the development server

For production, make sure to set the environment variable in your deployment environment.
