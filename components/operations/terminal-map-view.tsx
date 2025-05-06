"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Define types for GSE and Terminal data
interface GSEItem {
  id: string
  type: string
  status: "available" | "in-use" | "maintenance" | "out-of-service"
  location: {
    lat: number
    lng: number
  }
  lastUpdated: string
  assignedTo?: string
  batteryLevel?: number
  fuelLevel?: number
}

interface Terminal {
  id: string
  name: string
  gates: {
    id: string
    name: string
    location: {
      lat: number
      lng: number
    }
    status: "occupied" | "available" | "maintenance"
    aircraft?: {
      id: string
      type: string
      flight: string
      arrival: string
      departure: string
    }
  }[]
}

// Mock data - in a real app, this would come from an API
const mockGSEData: GSEItem[] = [
  {
    id: "gse-001",
    type: "Baggage Tractor",
    status: "available",
    location: { lat: 43.6772, lng: -79.6306 },
    lastUpdated: "2023-04-17T14:30:00Z",
    batteryLevel: 87,
  },
  {
    id: "gse-002",
    type: "Passenger Bus",
    status: "in-use",
    location: { lat: 43.6782, lng: -79.6316 },
    lastUpdated: "2023-04-17T14:35:00Z",
    assignedTo: "Flight AC123",
    fuelLevel: 65,
  },
  {
    id: "gse-003",
    type: "Pushback Tug",
    status: "maintenance",
    location: { lat: 43.6762, lng: -79.6296 },
    lastUpdated: "2023-04-17T14:20:00Z",
  },
]

const mockTerminalData: Terminal[] = [
  {
    id: "terminal-1",
    name: "Terminal 1",
    gates: [
      {
        id: "gate-a1",
        name: "Gate A1",
        location: { lat: 43.6775, lng: -79.631 },
        status: "occupied",
        aircraft: {
          id: "ac-123",
          type: "Boeing 787",
          flight: "AC123",
          arrival: "2023-04-17T14:00:00Z",
          departure: "2023-04-17T16:30:00Z",
        },
      },
      {
        id: "gate-a2",
        name: "Gate A2",
        location: { lat: 43.6778, lng: -79.6312 },
        status: "available",
      },
    ],
  },
  {
    id: "terminal-3",
    name: "Terminal 3",
    gates: [
      {
        id: "gate-c1",
        name: "Gate C1",
        location: { lat: 43.6785, lng: -79.632 },
        status: "maintenance",
      },
      {
        id: "gate-c2",
        name: "Gate C2",
        location: { lat: 43.6788, lng: -79.6322 },
        status: "occupied",
        aircraft: {
          id: "ac-456",
          type: "Airbus A320",
          flight: "AC456",
          arrival: "2023-04-17T13:30:00Z",
          departure: "2023-04-17T15:00:00Z",
        },
      },
    ],
  },
]

export default function TerminalMapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedItem, setSelectedItem] = useState<GSEItem | null>(null)
  const [selectedGate, setSelectedGate] = useState<Terminal["gates"][0] | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-79.6306, 43.6772], // Toronto Pearson Airport
      zoom: 15,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
      setLoading(false)

      // Add custom layers and sources here
      if (map.current) {
        // Add terminal buildings layer
        map.current.addSource("terminals", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: mockTerminalData.map((terminal) => ({
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  // This would be the actual terminal polygon in a real app
                  // For now, we'll create a simple rectangle around the first gate
                  [
                    [terminal.gates[0].location.lng - 0.001, terminal.gates[0].location.lat - 0.001],
                    [terminal.gates[0].location.lng + 0.001, terminal.gates[0].location.lat - 0.001],
                    [terminal.gates[0].location.lng + 0.001, terminal.gates[0].location.lat + 0.001],
                    [terminal.gates[0].location.lng - 0.001, terminal.gates[0].location.lat + 0.001],
                    [terminal.gates[0].location.lng - 0.001, terminal.gates[0].location.lat - 0.001],
                  ],
                ],
              },
              properties: {
                id: terminal.id,
                name: terminal.name,
              },
            })),
          },
        })

        map.current.addLayer({
          id: "terminals-fill",
          type: "fill",
          source: "terminals",
          paint: {
            "fill-color": "#e2e8f0",
            "fill-opacity": 0.6,
          },
        })

        map.current.addLayer({
          id: "terminals-outline",
          type: "line",
          source: "terminals",
          paint: {
            "line-color": "#94a3b8",
            "line-width": 2,
          },
        })

        // Add gates layer
        const gatesFeatures = mockTerminalData.flatMap((terminal) =>
          terminal.gates.map((gate) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [gate.location.lng, gate.location.lat],
            },
            properties: {
              id: gate.id,
              name: gate.name,
              status: gate.status,
              terminalId: terminal.id,
              terminalName: terminal.name,
              aircraft: gate.aircraft ? JSON.stringify(gate.aircraft) : null,
            },
          })),
        )

        map.current.addSource("gates", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: gatesFeatures,
          },
        })

        map.current.addLayer({
          id: "gates",
          type: "circle",
          source: "gates",
          paint: {
            "circle-radius": 8,
            "circle-color": [
              "match",
              ["get", "status"],
              "occupied",
              "#f59e0b",
              "available",
              "#10b981",
              "maintenance",
              "#ef4444",
              "#94a3b8",
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        })

        // Add GSE layer
        const gseFeatures = mockGSEData.map((gse) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [gse.location.lng, gse.location.lat],
          },
          properties: {
            id: gse.id,
            type: gse.type,
            status: gse.status,
            lastUpdated: gse.lastUpdated,
            assignedTo: gse.assignedTo || null,
            batteryLevel: gse.batteryLevel || null,
            fuelLevel: gse.fuelLevel || null,
          },
        }))

        map.current.addSource("gse", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: gseFeatures,
          },
        })

        map.current.addLayer({
          id: "gse",
          type: "circle",
          source: "gse",
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "match",
              ["get", "status"],
              "available",
              "#10b981",
              "in-use",
              "#3b82f6",
              "maintenance",
              "#f59e0b",
              "out-of-service",
              "#ef4444",
              "#94a3b8",
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
          },
        })

        // Add click handlers
        map.current.on("click", "gse", (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0]
            const gseId = feature.properties?.id
            const selectedGSE = mockGSEData.find((g) => g.id === gseId) || null
            setSelectedItem(selectedGSE)
            setSelectedGate(null)
          }
        })

        map.current.on("click", "gates", (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0]
            const gateId = feature.properties?.id
            const terminalId = feature.properties?.terminalId

            const terminal = mockTerminalData.find((t) => t.id === terminalId)
            if (terminal) {
              const gate = terminal.gates.find((g) => g.id === gateId) || null
              setSelectedGate(gate)
              setSelectedItem(null)
            }
          }
        })

        // Change cursor on hover
        map.current.on("mouseenter", "gse", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current.on("mouseleave", "gse", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })

        map.current.on("mouseenter", "gates", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current.on("mouseleave", "gates", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Filter GSE based on active tab
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    if (activeTab === "all") {
      map.current.setFilter("gse", null)
    } else {
      map.current.setFilter("gse", ["==", "status", activeTab])
    }
  }, [activeTab, mapLoaded])

  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Terminal & GSE Live Map</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1000)
            }}
          >
            Refresh
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="in-use">In Use</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="out-of-service">Out of Service</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 relative h-[calc(100%-5rem)]">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-10 flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapContainer} className="w-full h-full" />

        {selectedItem && (
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {selectedItem.type}
              <Badge
                className={`ml-2 ${
                  selectedItem.status === "available"
                    ? "bg-green-500"
                    : selectedItem.status === "in-use"
                      ? "bg-blue-500"
                      : selectedItem.status === "maintenance"
                        ? "bg-amber-500"
                        : "bg-red-500"
                }`}
              >
                {selectedItem.status.replace("-", " ")}
              </Badge>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedItem.id}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatTime(selectedItem.lastUpdated)}
            </p>
            {selectedItem.assignedTo && <p className="text-sm">Assigned to: {selectedItem.assignedTo}</p>}
            {selectedItem.batteryLevel !== undefined && (
              <div className="mt-2">
                <p className="text-sm">Battery: {selectedItem.batteryLevel}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      selectedItem.batteryLevel > 70
                        ? "bg-green-500"
                        : selectedItem.batteryLevel > 30
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${selectedItem.batteryLevel}%` }}
                  ></div>
                </div>
              </div>
            )}
            {selectedItem.fuelLevel !== undefined && (
              <div className="mt-2">
                <p className="text-sm">Fuel: {selectedItem.fuelLevel}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      selectedItem.fuelLevel > 70
                        ? "bg-green-500"
                        : selectedItem.fuelLevel > 30
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${selectedItem.fuelLevel}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Button size="sm">Details</Button>
            </div>
          </div>
        )}

        {selectedGate && (
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold text-lg">{selectedGate.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mockTerminalData.find((t) => t.gates.some((g) => g.id === selectedGate.id))?.name}
            </p>
            <Badge
              className={`mt-1 ${
                selectedGate.status === "available"
                  ? "bg-green-500"
                  : selectedGate.status === "occupied"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            >
              {selectedGate.status}
            </Badge>

            {selectedGate.aircraft && (
              <div className="mt-2 border-t pt-2">
                <p className="font-medium">{selectedGate.aircraft.flight}</p>
                <p className="text-sm">{selectedGate.aircraft.type}</p>
                <div className="flex justify-between text-xs mt-1">
                  <span>Arrival: {formatTime(selectedGate.aircraft.arrival)}</span>
                  <span>Departure: {formatTime(selectedGate.aircraft.departure)}</span>
                </div>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedGate(null)}>
                Close
              </Button>
              <Button size="sm">Assign GSE</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
