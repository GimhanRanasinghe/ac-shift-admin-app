"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the types for our data
type Equipment = {
  id: string
  type: string
  category: string
  code: string
  powerType: string
  aircraftCompatibility: string
  location: { lat: number; lng: number }
  distance: string
  status: string
  lastUsed: string
  fuelLevel?: string | null
  batteryLevel?: string | null
  lastMaintenance: string
  nextMaintenance: string
  certificationRequired: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  year?: string
  description?: string
  sensors?: {
    telematicsDevice?: boolean
    telematicsSerial?: string
    bleBeacon?: boolean
    bleSerial?: string
    levelSensor?: boolean
    levelSensorSerial?: string
    tempSensor?: boolean
    tempSensorSerial?: string
    aiDashcam?: boolean
    aiDashcamSerial?: string
    cameras?: boolean
    camerasSerial?: string
  }
}

type EquipmentType = {
  value: string
  label: string
  isPowered: boolean
  maintenanceInterval: number
  requiredCertification: string
  category: string
  description?: string
  activeUnits?: number
  lastUpdated?: string
}

type MaintenanceTask = {
  id: string
  equipmentId: string
  equipmentType: string
  description: string
  priority: string
  status: string
  assignedTo: string
  createdDate: string
  dueDate: string
  completedDate?: string
  maintenanceType: string
  estimatedDuration?: string
}

type User = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
}

// Define the shape of our context data
interface DataContextType {
  equipment: Equipment[]
  equipmentTypes: EquipmentType[]
  maintenanceTasks: MaintenanceTask[]
  users: User[]

  // CRUD operations for equipment
  addEquipment: (equipment: Equipment) => void
  updateEquipment: (id: string, updates: Partial<Equipment>) => void
  deleteEquipment: (id: string) => void
  getEquipmentById: (id: string) => Equipment | undefined

  // CRUD operations for equipment types
  addEquipmentType: (equipmentType: EquipmentType) => void
  updateEquipmentType: (value: string, updates: Partial<EquipmentType>) => void
  deleteEquipmentType: (value: string) => void
  getEquipmentTypeByValue: (value: string) => EquipmentType | undefined

  // CRUD operations for maintenance tasks
  addMaintenanceTask: (task: MaintenanceTask) => void
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void
  deleteMaintenanceTask: (id: string) => void
  getMaintenanceTaskById: (id: string) => MaintenanceTask | undefined

  // CRUD operations for users
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  getUserById: (id: string) => User | undefined

  // Reset data to initial state
  resetData: () => void
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined)

// Import initial data
import initialEquipment from "@/data/equipment.json"
import initialEquipmentTypes from "@/data/equipment-types.json"

// Initial maintenance tasks data
const initialMaintenanceTasks = [
  {
    id: "WO-1001",
    equipmentId: "BTG-1045",
    equipmentType: "Baggage Tractor",
    description: "Engine oil change and filter replacement",
    priority: "medium",
    status: "open",
    assignedTo: "John Smith",
    createdDate: "2024-05-01",
    dueDate: "2024-05-10",
    maintenanceType: "Scheduled",
  },
  {
    id: "WO-1002",
    equipmentId: "BLW-0872",
    equipmentType: "Belt Loader",
    description: "Hydraulic system inspection and fluid top-up",
    priority: "high",
    status: "in-progress",
    assignedTo: "Sarah Johnson",
    createdDate: "2024-05-02",
    dueDate: "2024-05-08",
    maintenanceType: "Scheduled",
  },
  {
    id: "WO-1003",
    equipmentId: "ATF-0023",
    equipmentType: "Pushback Tractor",
    description: "Brake system overhaul",
    priority: "high",
    status: "parts-ordered",
    assignedTo: "Mike Davis",
    createdDate: "2024-05-03",
    dueDate: "2024-05-12",
    maintenanceType: "Corrective",
  },
  {
    id: "WO-1004",
    equipmentId: "GPB-0789",
    equipmentType: "Ground Power Unit",
    description: "Generator maintenance and testing",
    priority: "medium",
    status: "open",
    assignedTo: "Unassigned",
    createdDate: "2024-05-04",
    dueDate: "2024-05-15",
    maintenanceType: "Preventive",
  },
  {
    id: "WO-1005",
    equipmentId: "CLS-0456",
    equipmentType: "Container Loader",
    description: "Electrical system troubleshooting",
    priority: "high",
    status: "in-progress",
    assignedTo: "Emily Wilson",
    createdDate: "2024-05-05",
    dueDate: "2024-05-09",
    maintenanceType: "Unscheduled",
  },
]

// Initial users data
const initialUsers = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@aircanada.ca",
    role: "Administrator",
    department: "IT",
    status: "active",
    lastLogin: "2024-05-09T10:30:00",
  },
  {
    id: "U002",
    name: "Sarah Johnson",
    email: "sarah.johnson@aircanada.ca",
    role: "Manager",
    department: "Operations",
    status: "active",
    lastLogin: "2024-05-09T09:15:00",
  },
  {
    id: "U003",
    name: "Michael Brown",
    email: "michael.brown@aircanada.ca",
    role: "Supervisor",
    department: "Maintenance",
    status: "active",
    lastLogin: "2024-05-08T16:45:00",
  },
  {
    id: "U004",
    name: "Emily Wilson",
    email: "emily.wilson@aircanada.ca",
    role: "Analyst",
    department: "Planning",
    status: "active",
    lastLogin: "2024-05-09T08:30:00",
  },
  {
    id: "U005",
    name: "Robert Davis",
    email: "robert.davis@aircanada.ca",
    role: "Technician",
    department: "Maintenance",
    status: "inactive",
    lastLogin: "2024-04-28T14:20:00",
  },
]

// Enhanced equipment types with additional properties
const enhancedEquipmentTypes = initialEquipmentTypes
  .filter((type) => type.value !== "all")
  .map((type) => ({
    ...type,
    isPowered: [
      "baggage-tractor",
      "belt-loader",
      "pushback-tractor",
      "container-loader",
      "ground-power",
      "lavatory",
      "water",
      "airstart",
      "de-icing",
      "catering",
      "aircraft-tug",
    ].includes(type.value),
    maintenanceInterval: type.value.includes("tractor") || type.value.includes("loader") ? 60 : 90,
    requiredCertification:
      type.value.includes("tractor") || type.value.includes("tug")
        ? "Heavy Equipment"
        : type.value.includes("loader")
          ? "Lifting Equipment"
          : "Basic GSE",
    category:
      type.value.includes("tractor") || type.value.includes("tug")
        ? "towing"
        : type.value.includes("loader")
          ? "loading"
          : "support",
    activeUnits: Math.floor(Math.random() * 20) + 5,
    lastUpdated: "2024-04-01",
    description: `${type.label} is used for ${
      type.value.includes("tractor")
        ? "towing baggage carts and equipment around the airport"
        : type.value.includes("loader")
          ? "loading and unloading baggage and cargo from aircraft"
          : "supporting various ground operations at the airport"
    }.`,
  }))

// Create the provider component
export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or default data
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    if (typeof window !== "undefined") {
      const savedEquipment = localStorage.getItem("gse-equipment")
      return savedEquipment ? JSON.parse(savedEquipment) : initialEquipment
    }
    return initialEquipment
  })

  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>(() => {
    if (typeof window !== "undefined") {
      const savedTypes = localStorage.getItem("gse-equipment-types")
      console.log("Loading equipment types:", savedTypes ? "from localStorage" : "from default data")
      return savedTypes ? JSON.parse(savedTypes) : enhancedEquipmentTypes
    }
    return enhancedEquipmentTypes
  })

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("gse-maintenance-tasks")
      return savedTasks ? JSON.parse(savedTasks) : initialMaintenanceTasks
    }
    return initialMaintenanceTasks
  })

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const savedUsers = localStorage.getItem("gse-users")
      return savedUsers ? JSON.parse(savedUsers) : initialUsers
    }
    return initialUsers
  })

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gse-equipment", JSON.stringify(equipment))
    }
  }, [equipment])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gse-equipment-types", JSON.stringify(equipmentTypes))
    }
  }, [equipmentTypes])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gse-maintenance-tasks", JSON.stringify(maintenanceTasks))
    }
  }, [maintenanceTasks])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gse-users", JSON.stringify(users))
    }
  }, [users])

  // CRUD operations for equipment
  const addEquipment = (newEquipment: Equipment) => {
    setEquipment((prev) => [...prev, newEquipment])
  }

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id))
  }

  const getEquipmentById = (id: string) => {
    return equipment.find((item) => item.id === id)
  }

  // CRUD operations for equipment types
  const addEquipmentType = (newType: EquipmentType) => {
    setEquipmentTypes((prev) => [...prev, newType])
  }

  const updateEquipmentType = (value: string, updates: Partial<EquipmentType>) => {
    setEquipmentTypes((prev) => prev.map((item) => (item.value === value ? { ...item, ...updates } : item)))
  }

  const deleteEquipmentType = (value: string) => {
    setEquipmentTypes((prev) => prev.filter((item) => item.value !== value))
  }

  const getEquipmentTypeByValue = (value: string) => {
    return equipmentTypes.find((item) => item.value === value)
  }

  // CRUD operations for maintenance tasks
  const addMaintenanceTask = (newTask: MaintenanceTask) => {
    setMaintenanceTasks((prev) => [...prev, newTask])
  }

  const updateMaintenanceTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setMaintenanceTasks((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteMaintenanceTask = (id: string) => {
    setMaintenanceTasks((prev) => prev.filter((item) => item.id !== id))
  }

  const getMaintenanceTaskById = (id: string) => {
    return maintenanceTasks.find((item) => item.id === id)
  }

  // CRUD operations for users
  const addUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((item) => item.id !== id))
  }

  const getUserById = (id: string) => {
    return users.find((item) => item.id === id)
  }

  // Reset data to initial state
  const resetData = () => {
    setEquipment(initialEquipment)
    setEquipmentTypes(enhancedEquipmentTypes)
    setMaintenanceTasks(initialMaintenanceTasks)
    setUsers(initialUsers)
  }

  const value = {
    equipment,
    equipmentTypes,
    maintenanceTasks,
    users,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    addEquipmentType,
    updateEquipmentType,
    deleteEquipmentType,
    getEquipmentTypeByValue,
    addMaintenanceTask,
    updateMaintenanceTask,
    deleteMaintenanceTask,
    getMaintenanceTaskById,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    resetData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
