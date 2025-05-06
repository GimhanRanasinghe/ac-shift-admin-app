"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { getEquipmentClass } from "@/utils/equipment-class"

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

// Import terminal positions for reference
import terminalPositions from "@/data/terminal-positions.json"

// Function to get equipment type abbreviation
function getEquipmentAbbreviation(type: string): string {
  const words = type.split(" ")
  if (words.length === 1) {
    return type.substring(0, 2).toUpperCase()
  }
  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

interface Equipment {
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
  certificationRequired: string
}

interface MapboxEquipmentMapProps {
  equipment: Equipment[]
  userCertifications?: string[]
  locateId?: string | null
}

export function MapboxEquipmentMap({ equipment, userCertifications = [], locateId = null }: MapboxEquipmentMapProps) {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  // Toronto Pearson Airport coordinates
  const [lng] = useState(-79.6306)
  const [lat] = useState(43.6772)
  const [zoom] = useState(15)

  // Check if user has the required certification for equipment
  const hasCertification = (certificationRequired: string) => {
    return userCertifications.includes(certificationRequired)
  }

  // Generate equipment positions based on their ID
  const getEquipmentPositions = () => {
    return equipment.map((item) => {
      // Create a deterministic but distributed position based on equipment ID
      const idSum = item.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)

      // Use the ID sum to create a position that's somewhat random but consistent
      const angle = (idSum % 360) * (Math.PI / 180)
      const distance = 0.001 + (idSum % 20) / 10000

      // Choose a terminal to be near
      const terminalIndex = idSum % terminalPositions.length
      const terminal = terminalPositions[terminalIndex]

      // Convert normalized coordinates to actual lat/lng
      // Center around Toronto Pearson Airport
      const terminalLng = lng + (terminal.x - 0.5) * 0.02
      const terminalLat = lat + (terminal.y - 0.5) * 0.02

      // Position around that terminal
      const equipmentLng = terminalLng + Math.cos(angle) * distance
      const equipmentLat = terminalLat + Math.sin(angle) * distance

      return {
        ...item,
        location: {
          lat: equipmentLat,
          lng: equipmentLng,
        },
      }
    })
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map with dark style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11", // Use dark style
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false, // Remove attribution control
      logoPosition: "bottom-right",
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

    // Remove the logo by adding a custom CSS rule after the map is loaded
    map.current.on("load", () => {
      // Hide mapbox logo and attribution
      const style = document.createElement("style")
      style.textContent = `
        .mapboxgl-ctrl-logo { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
      `
      document.head.appendChild(style)
    })

    // Add user location marker with pulsating effect
    const userLocationEl = document.createElement("div")
    userLocationEl.className = "user-location-marker"
    userLocationEl.innerHTML = `
      <div class="user-location-dot"></div>
      <div class="user-location-pulse"></div>
    `

    const userMarker = new mapboxgl.Marker(userLocationEl).setLngLat([lng, lat]).addTo(map.current)

    // Clean up on unmount
    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [lng, lat, zoom])

  // Find the useEffect that adds equipment markers and update it to highlight the located equipment
  useEffect(() => {
    if (!map.current) return

    // Remove existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker:not(.user-marker)")
    markers.forEach((marker) => marker.remove())

    // Get equipment with positions
    const equipmentWithPositions = getEquipmentPositions()

    // Add equipment markers
    equipmentWithPositions.forEach((item) => {
      // Create marker element
      const el = document.createElement("div")
      el.className = "equipment-marker"

      // Add selected class if this is the last selected equipment
      if (item.id === lastSelectedId || item.id === locateId) {
        el.className += " selected"
      }

      // Get equipment abbreviation
      const equipAbbr = getEquipmentAbbreviation(item.type)

      // Style based on status and certification
      let color = "#6b7280" // Gray for in use
      if (item.status === "Available") {
        color = hasCertification(item.certificationRequired) ? "#00C853" : "#FFA000" // Green or amber
      } else if (item.status === "Maintenance") {
        color = "#FF3D00" // Red
      }

      // Different shape for different classes
      const shape = getEquipmentClass(item.category, item.powerType) === "C" ? "square" : "circle"

      el.style.backgroundColor = color
      el.style.width = "20px"
      el.style.height = "20px"
      el.style.borderRadius = shape === "circle" ? "50%" : "3px"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.color = "white"
      el.style.fontWeight = "bold"
      el.style.fontSize = "10px"
      el.style.border = "2px solid #4285F4" // Blue border for all equipment indicators
      el.style.cursor = "pointer"
      el.innerHTML = equipAbbr

      // If this is the equipment we're locating, make it pulse
      if (item.id === locateId) {
        el.style.animation = "pulse 1.5s infinite"

        // Center the map on this equipment
        map.current?.flyTo({
          center: [item.location.lng, item.location.lat],
          zoom: 17,
          duration: 1000,
        })

        // Set this as the selected equipment
        setSelectedEquipment(item)
        setLastSelectedId(item.id)
      }

      // Create popup with dark background and proper text colors
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        className: "equipment-popup",
      }).setHTML(`
        <div class="p-3 bg-card">
          <div class="font-bold text-card-foreground mb-1">${item.type}</div>
          <div class="text-card-foreground mb-2">${item.id}</div>
          <div class="mb-1">
            ${
              hasCertification(item.certificationRequired)
                ? '<div class="flex items-center gap-1"><span class="text-status-green">✓</span> <span class="text-card-foreground">Certified</span></div>'
                : '<div class="flex items-center gap-1"><span class="text-status-amber">⚠</span> <span class="text-card-foreground">Certification Required</span></div>'
            }
          </div>
          <div class="equipment-status ${
            item.status === "Available"
              ? "text-status-green"
              : item.status === "Maintenance"
                ? "text-status-red"
                : "text-muted-foreground"
          }">${item.status}</div>
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([item.location.lng, item.location.lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Add click event
      el.addEventListener("click", () => {
        setSelectedEquipment(item)
        setLastSelectedId(item.id)
      })
    })
  }, [equipment, userCertifications, locateId, lastSelectedId])

  const handleCheckout = (equipmentId: string) => {
    router.push(`/equipment/checkout/${equipmentId}`)
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />

      <div className="absolute top-2 left-2 z-10 bg-card bg-opacity-90 p-3 rounded-md text-sm shadow-md">
        <div className="font-bold text-card-foreground">YYZ Airport Map</div>
        <div className="text-xs text-muted-foreground">Showing {equipment.length} equipment items</div>
      </div>

      <div className="absolute top-24 right-2 z-10">
        <button
          onClick={() => {
            if (map.current) {
              map.current.flyTo({
                center: [lng, lat],
                zoom: 15,
                duration: 1000,
              })
            }
          }}
          className="bg-card bg-opacity-90 p-2 rounded-md shadow-md hover:bg-muted transition-colors"
          aria-label="Center to my location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-card-foreground"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.94 11A8 8 0 0 0 13 4.06"></path>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="M4.06 11a8 8 0 0 0 0 2"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="M19.94 13a8 8 0 0 1-7.94 6.94"></path>
          </svg>
        </button>
      </div>

      {selectedEquipment && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-card border-border shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-card-foreground">{selectedEquipment.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-muted text-card-foreground border-border rounded-full">
                      {selectedEquipment.id}
                    </Badge>
                    <Badge
                      variant={
                        selectedEquipment.status === "Available"
                          ? "outline"
                          : selectedEquipment.status === "Maintenance"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        selectedEquipment.status === "Available"
                          ? "border-status-green text-status-green"
                          : selectedEquipment.status === "Maintenance"
                            ? "bg-status-red text-white"
                            : "bg-gray-600 text-white"
                      }
                    >
                      {selectedEquipment.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEquipment(null)}
                  className="text-card-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <p className="text-muted-foreground">Class</p>
                  <p className="text-card-foreground">
                    <span className="equipment-class equipment-class-blue">
                      {getEquipmentClass(selectedEquipment.category, selectedEquipment.powerType)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Distance</p>
                  <p className="text-card-foreground">{selectedEquipment.distance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Aircraft</p>
                  <p className="text-card-foreground">{selectedEquipment.aircraftCompatibility}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Used</p>
                  <p className="text-card-foreground">{selectedEquipment.lastUsed}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 p-2 rounded-md bg-muted">
                {hasCertification(selectedEquipment.certificationRequired) ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-status-green" />
                    <div>
                      <p className="font-medium text-status-green">Certification Verified</p>
                      <p className="text-sm text-muted-foreground">{selectedEquipment.certificationRequired}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-status-amber" />
                    <div>
                      <p className="font-medium text-status-amber">Certification Required</p>
                      <p className="text-sm text-muted-foreground">{selectedEquipment.certificationRequired}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <div className="flex gap-2 w-full">
                <Button
                  className="w-full bg-aircanada-blue hover:bg-blue-600 text-white rounded-full"
                  onClick={() => handleCheckout(selectedEquipment.id)}
                  disabled={
                    selectedEquipment.status !== "Available" ||
                    !hasCertification(selectedEquipment.certificationRequired)
                  }
                >
                  Reserve / Check Out
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
