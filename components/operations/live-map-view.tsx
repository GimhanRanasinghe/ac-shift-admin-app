"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/context/data-context"
import { Users, AlertCircle } from "lucide-react"

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

// Terminal positions (simplified for example)
const terminalPositions = [
  { id: "T1", name: "Terminal 1", lat: 43.6777, lng: -79.6248, gates: ["A1", "A2", "A3", "B1", "B2", "C1", "C2"] },
  { id: "T3", name: "Terminal 3", lat: 43.6814, lng: -79.6226, gates: ["D1", "D2", "E1", "E2", "F1", "F2"] },
]

export function LiveMapView() {
  const { equipment, users } = useData()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedView, setSelectedView] = useState("all")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [showPersonnel, setShowPersonnel] = useState(true)
  const [showAlerts, setShowAlerts] = useState(true)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Toronto Pearson Airport coordinates
    const lng = -79.6306
    const lat = 43.6772

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

    // Add scale
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right")

    // When map loads
    map.current.on("load", () => {
      // Add terminal buildings
      if (map.current) {
        map.current.addSource("terminals", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: terminalPositions.map((terminal) => ({
              type: "Feature",
              properties: {
                id: terminal.id,
                name: terminal.name,
                gates: terminal.gates,
              },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [terminal.lng - 0.003, terminal.lat - 0.001],
                    [terminal.lng + 0.003, terminal.lat - 0.001],
                    [terminal.lng + 0.003, terminal.lat + 0.001],
                    [terminal.lng - 0.003, terminal.lat + 0.001],
                    [terminal.lng - 0.003, terminal.lat - 0.001],
                  ],
                ],
              },
            })),
          },
        })

        map.current.addLayer({
          id: "terminals-fill",
          type: "fill",
          source: "terminals",
          paint: {
            "fill-color": "#1f2937",
            "fill-opacity": 0.8,
          },
        })

        map.current.addLayer({
          id: "terminals-outline",
          type: "line",
          source: "terminals",
          paint: {
            "line-color": "#4b5563",
            "line-width": 2,
          },
        })

        // Add terminal labels
        map.current.addLayer({
          id: "terminals-label",
          type: "symbol",
          source: "terminals",
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Bold"],
            "text-size": 12,
            "text-anchor": "center",
          },
          paint: {
            "text-color": "#ffffff",
          },
        })

        // Add runways
        map.current.addSource("runways", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { id: "05-23", name: "Runway 05/23" },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [-79.6406, 43.6672],
                    [-79.6206, 43.6872],
                  ],
                },
              },
              {
                type: "Feature",
                properties: { id: "06L-24R", name: "Runway 06L/24R" },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [-79.6506, 43.6772],
                    [-79.6106, 43.6772],
                  ],
                },
              },
              {
                type: "Feature",
                properties: { id: "06R-24L", name: "Runway 06R/24L" },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [-79.6506, 43.6872],
                    [-79.6106, 43.6872],
                  ],
                },
              },
            ],
          },
        })

        map.current.addLayer({
          id: "runways",
          type: "line",
          source: "runways",
          paint: {
            "line-color": "#4b5563",
            "line-width": 20,
          },
        })

        // Add runway markings
        map.current.addLayer({
          id: "runway-markings",
          type: "line",
          source: "runways",
          paint: {
            "line-color": "#ffffff",
            "line-width": 2,
            "line-dasharray": [10, 10],
          },
        })
      }
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Add equipment markers
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return

    // Remove existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker")
    markers.forEach((marker) => marker.remove())

    // Filter equipment based on selected view
    const filteredEquipment = equipment.filter((item) => {
      if (selectedView === "all") return true
      if (selectedView === "available") return item.status === "Available"
      if (selectedView === "in-use") return item.status === "In Use"
      if (selectedView === "maintenance") return item.status === "Maintenance"
      return true
    })

    // Add equipment markers
    filteredEquipment.forEach((item) => {
      // Create a random but consistent position based on equipment ID
      const idSum = item.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
      const terminalIndex = idSum % terminalPositions.length
      const terminal = terminalPositions[terminalIndex]

      // Generate position near terminal
      const angle = (idSum % 360) * (Math.PI / 180)
      const distance = 0.001 + (idSum % 20) / 10000
      const lat = terminal.lat + Math.sin(angle) * distance
      const lng = terminal.lng + Math.cos(angle) * distance

      // Create marker element
      const el = document.createElement("div")
      el.className = "equipment-marker"

      // Style based on status
      let color = "#6b7280" // Gray for in use
      if (item.status === "Available") {
        color = "#10b981" // Green for available
      } else if (item.status === "Maintenance") {
        color = "#ef4444" // Red for maintenance
      }

      // Different shape for different categories
      const shape = item.category === "Non-Powered Equipment" ? "square" : "circle"

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
      el.style.border = "2px solid #ffffff"
      el.style.cursor = "pointer"
      el.innerHTML = item.id.substring(0, 2)

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <div class="font-bold mb-1">${item.type}</div>
          <div class="mb-2">${item.id}</div>
          <div class="text-xs ${
            item.status === "Available"
              ? "text-green-500"
              : item.status === "Maintenance"
                ? "text-red-500"
                : "text-gray-500"
          }">${item.status}</div>
        </div>
      `)

      // Add marker to map
      new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map.current!)
    })

    // Add personnel markers if enabled
    if (showPersonnel) {
      users.slice(0, 5).forEach((user, index) => {
        // Create a position for the user
        const terminalIndex = index % terminalPositions.length
        const terminal = terminalPositions[terminalIndex]

        // Generate position near terminal
        const angle = index * 72 * (Math.PI / 180)
        const distance = 0.0015
        const lat = terminal.lat + Math.sin(angle) * distance
        const lng = terminal.lng + Math.cos(angle) * distance

        // Create marker element
        const el = document.createElement("div")
        el.className = "personnel-marker"
        el.style.backgroundColor = "#3b82f6"
        el.style.width = "16px"
        el.style.height = "16px"
        el.style.borderRadius = "50%"
        el.style.border = "2px solid #ffffff"
        el.style.cursor = "pointer"

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <div class="font-bold mb-1">${user.name}</div>
            <div class="text-xs">${user.role}</div>
            <div class="text-xs">${user.department}</div>
          </div>
        `)

        // Add marker to map
        new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map.current!)
      })
    }

    // Add alert markers if enabled
    if (showAlerts) {
      // Sample alerts
      const alerts = [
        { id: "A1", message: "Equipment breakdown", lat: 43.6777, lng: -79.6228, severity: "high" },
        { id: "A2", message: "Fuel spill", lat: 43.6814, lng: -79.6246, severity: "medium" },
      ]

      alerts.forEach((alert) => {
        // Create marker element
        const el = document.createElement("div")
        el.className = "alert-marker"
        el.style.backgroundColor = alert.severity === "high" ? "#ef4444" : "#f59e0b"
        el.style.width = "24px"
        el.style.height = "24px"
        el.style.borderRadius = "50%"
        el.style.border = "3px solid #ffffff"
        el.style.cursor = "pointer"
        el.style.display = "flex"
        el.style.alignItems = "center"
        el.style.justifyContent = "center"
        el.innerHTML = "!"
        el.style.fontWeight = "bold"
        el.style.color = "white"

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <div class="font-bold mb-1">Alert: ${alert.id}</div>
            <div class="text-sm">${alert.message}</div>
            <div class="text-xs mt-1 ${
              alert.severity === "high" ? "text-red-500" : "text-amber-500"
            }">Severity: ${alert.severity}</div>
          </div>
        `)

        // Add marker to map
        new mapboxgl.Marker(el).setLngLat([alert.lng, alert.lat]).setPopup(popup).addTo(map.current!)
      })
    }
  }, [equipment, selectedView, showPersonnel, showAlerts, users])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Live Terminal & GSE Map</CardTitle>
          <div className="flex gap-2">
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">All Equipment</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="in-use">In Use</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div ref={mapContainer} className="h-[600px] w-full" />

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <Button
            variant={showPersonnel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPersonnel(!showPersonnel)}
          >
            <Users className="h-4 w-4 mr-2" />
            Personnel
          </Button>
          <Button variant={showAlerts ? "default" : "outline"} size="sm" onClick={() => setShowAlerts(!showAlerts)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10 bg-card p-3 rounded-md shadow-md">
          <h3 className="text-sm font-medium mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-xs">In Use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Personnel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs">Alert</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
