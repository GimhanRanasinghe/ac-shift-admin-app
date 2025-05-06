"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the feature flags interface
export interface FeatureFlags {
  addEquipment: boolean
  editEquipment: boolean
  exportData: boolean
  decommissionEquipment: boolean
  maintenanceHistory: boolean
  dateRangeFilter: boolean
  advancedFilters: boolean
  mapView: boolean
  // Add more feature flags here as needed
}

// Define the context type
interface FeatureFlagsContextType {
  featureFlags: FeatureFlags
  toggleFeatureFlag: (flagName: keyof FeatureFlags) => void
  isFeatureEnabled: (flagName: keyof FeatureFlags) => boolean
  resetFeatureFlags: () => void
}

// Create the context
const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined)

// Default feature flags
const defaultFeatureFlags: FeatureFlags = {
  addEquipment: false,
  editEquipment: true,
  exportData: true,
  decommissionEquipment: true,
  maintenanceHistory: true,
  dateRangeFilter: true,
  advancedFilters: true,
  mapView: true,
  // Add more default values here
}

// Create the provider component
export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or default values
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(() => {
    if (typeof window !== "undefined") {
      const savedFlags = localStorage.getItem("gse-feature-flags")
      return savedFlags ? JSON.parse(savedFlags) : defaultFeatureFlags
    }
    return defaultFeatureFlags
  })

  // Save to localStorage whenever feature flags change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gse-feature-flags", JSON.stringify(featureFlags))
    }
  }, [featureFlags])

  // Toggle a feature flag
  const toggleFeatureFlag = (flagName: keyof FeatureFlags) => {
    setFeatureFlags((prev) => ({
      ...prev,
      [flagName]: !prev[flagName],
    }))
  }

  // Check if a feature is enabled
  const isFeatureEnabled = (flagName: keyof FeatureFlags) => {
    return featureFlags[flagName]
  }

  // Reset all feature flags to default values
  const resetFeatureFlags = () => {
    setFeatureFlags(defaultFeatureFlags)
  }

  const value = {
    featureFlags,
    toggleFeatureFlag,
    isFeatureEnabled,
    resetFeatureFlags,
  }

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
}

// Custom hook to use the feature flags context
export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext)
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider")
  }
  return context
}
