"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { SearchHeader } from "@/components/equipment-search/search-header"
import { SearchFilters } from "@/components/equipment-search/search-filters"
import { ViewToggle } from "@/components/equipment-search/view-toggle"
import { SearchResults } from "@/components/equipment-search/search-results"
import { ApiEquipmentSearch } from "@/components/equipment-search/api-equipment-search"

// Import data
import userData from "@/data/user.json"
import equipmentData from "@/data/equipment.json"
import equipmentTypes from "@/data/equipment-types.json"
import aircraftTypes from "@/data/aircraft-types.json"

export default function EquipmentSearch() {
  const searchParams = useSearchParams()
  const locateId = searchParams.get("locate")
  const [searchQuery, setSearchQuery] = useState("")
  const [equipmentType, setEquipmentType] = useState("all")
  const [aircraft, setAircraft] = useState("all")
  const [viewMode, setViewMode] = useState(locateId ? "map" : "map")
  const [showInUse, setShowInUse] = useState(true)

  // Add this useEffect to handle locating equipment
  useEffect(() => {
    if (locateId) {
      // Set view mode to map when locating equipment
      setViewMode("map")

      // Find the equipment to highlight
      const equipmentToLocate = equipmentData.find((item) => item.id === locateId)

      // In a real app, you would center the map on this equipment
      console.log("Locating equipment:", equipmentToLocate)
    }
  }, [locateId])

  // Extract user certifications
  const userCertifications = userData.certifications.map((cert) => cert.name)

  // Check if user has the required certification for equipment
  const hasCertification = (certificationRequired: string) => {
    return userCertifications.includes(certificationRequired)
  }

  // Filter equipment based on search criteria
  const filteredEquipment = equipmentData.filter((equipment) => {
    const matchesSearch =
      searchQuery === "" ||
      equipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType =
      equipmentType === "all" ||
      (equipmentType === "baggage-tractor" && equipment.code === "BTG") ||
      (equipmentType === "belt-loader" && equipment.code === "BLW") ||
      (equipmentType === "pushback-tractor" &&
        (equipment.code === "ATF" ||
          equipment.code === "ATB" ||
          equipment.code === "ATD" ||
          equipment.code === "ATJ")) ||
      (equipmentType === "container-loader" && equipment.code === "CLS") ||
      (equipmentType === "ground-power" && equipment.code.startsWith("GP")) ||
      (equipmentType === "lavatory" && equipment.code === "LTL") ||
      (equipmentType === "water" && equipment.code === "WTL") ||
      (equipmentType === "airstart" && equipment.code === "ASL") ||
      (equipmentType === "de-icing" && equipment.code === "DIC") ||
      (equipmentType === "catering" && equipment.code === "CAT") ||
      (equipmentType === "stairs" && (equipment.code === "STR" || equipment.code === "PS")) ||
      (equipmentType === "aircraft-tug" && equipment.code === "TUG") ||
      (equipmentType === "towbar" && equipment.code.startsWith("AB")) ||
      (equipmentType === "lavatory-cart" && equipment.code === "LC") ||
      (equipmentType === "wheelchair" && equipment.code === "WL")

    const matchesAircraft =
      aircraft === "all" ||
      (aircraft === "narrow" && equipment.aircraftCompatibility.includes("Narrow")) ||
      (aircraft === "wide" && equipment.aircraftCompatibility.includes("Wide")) ||
      (aircraft === "777" && equipment.aircraftCompatibility.includes("777")) ||
      (aircraft === "a320" &&
        (equipment.aircraftCompatibility.includes("All") ||
          equipment.aircraftCompatibility.includes("A320") ||
          equipment.aircraftCompatibility.includes("A319") ||
          equipment.aircraftCompatibility.includes("A321"))) ||
      (aircraft === "a330" &&
        (equipment.aircraftCompatibility.includes("Wide") || equipment.aircraftCompatibility.includes("A333"))) ||
      (aircraft === "a350" && equipment.aircraftCompatibility.includes("Wide")) ||
      (aircraft === "737" &&
        (equipment.aircraftCompatibility.includes("Narrow") || equipment.aircraftCompatibility.includes("737"))) ||
      (aircraft === "787" &&
        (equipment.aircraftCompatibility.includes("Wide") || equipment.aircraftCompatibility.includes("787")))

    // Filter by status
    const matchesStatus = equipment.status === "Available" || (showInUse && equipment.status === "In Use")

    return matchesSearch && matchesType && matchesAircraft && matchesStatus
  })

  // Sort by distance
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    return Number.parseInt(a.distance) - Number.parseInt(b.distance)
  })

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <SearchHeader showInUse={showInUse} setShowInUse={setShowInUse} />

        <div className="space-y-4">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            equipmentType={equipmentType}
            setEquipmentType={setEquipmentType}
            aircraft={aircraft}
            setAircraft={setAircraft}
            equipmentTypes={equipmentTypes}
            aircraftTypes={aircraftTypes}
          />

          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} equipmentCount={sortedEquipment.length} />

          <SearchResults
            viewMode={viewMode}
            equipment={sortedEquipment}
            userCertifications={userCertifications}
            hasCertification={hasCertification}
            locateId={locateId}
          />

          {/* API Example - This demonstrates using the global API configuration */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">API Integration Example</h2>
            <ApiEquipmentSearch />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
