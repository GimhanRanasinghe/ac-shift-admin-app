"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle } from "lucide-react"

// Import data
import terminalPositions from "@/data/terminal-positions.json"
import runwayPositions from "@/data/runway-positions.json"

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

interface EquipmentMapProps {
  equipment: Equipment[]
  userCertifications?: string[]
}

export function EquipmentMap({ equipment, userCertifications = [] }: EquipmentMapProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [hoveredEquipment, setHoveredEquipment] = useState<Equipment | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Check if user has the required certification for equipment
  const hasCertification = (certificationRequired: string) => {
    return userCertifications.includes(certificationRequired)
  }

  // Calculate equipment positions based on their distance
  const getEquipmentPositions = () => {
    return equipment.map((item) => {
      // Create a deterministic but distributed position based on equipment ID
      const idSum = item.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)

      // Use the ID sum to create a position that's somewhat random but consistent
      const angle = (idSum % 360) * (Math.PI / 180)
      const distance = 0.1 + (idSum % 20) / 100

      // Choose a terminal to be near
      const terminalIndex = idSum % terminalPositions.length
      const terminal = terminalPositions[terminalIndex]

      // Position around that terminal
      const x = terminal.x + Math.cos(angle) * distance
      const y = terminal.y + Math.sin(angle) * distance

      return {
        equipment: item,
        x: Math.max(0.05, Math.min(0.95, x)),
        y: Math.max(0.05, Math.min(0.95, y)),
        radius: item.category === "Non-Powered Equipment" ? 8 : 10, // Smaller radius for non-powered equipment
      }
    })
  }

  // Draw the airport map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const container = canvas.parentElement
      if (container) {
        const { width, height } = container.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setCanvasSize({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Draw the map and equipment
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#e5e7eb" // Light gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw runways
    ctx.lineWidth = 20
    ctx.strokeStyle = "#4b5563"
    runwayPositions.forEach((runway) => {
      ctx.beginPath()
      ctx.moveTo(runway.start.x * canvas.width, runway.start.y * canvas.height)
      ctx.lineTo(runway.end.x * canvas.width, runway.end.y * canvas.height)
      ctx.stroke()

      // Draw runway markings
      ctx.lineWidth = 2
      ctx.strokeStyle = "#ffffff"
      ctx.setLineDash([20, 20])
      ctx.beginPath()
      ctx.moveTo(runway.start.x * canvas.width, runway.start.y * canvas.height)
      ctx.lineTo(runway.end.x * canvas.width, runway.end.y * canvas.height)
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Draw terminals
    terminalPositions.forEach((terminal) => {
      // Terminal building
      ctx.fillStyle = "#1f2937"
      const terminalWidth = 80
      const terminalHeight = 40
      ctx.fillRect(
        terminal.x * canvas.width - terminalWidth / 2,
        terminal.y * canvas.height - terminalHeight / 2,
        terminalWidth,
        terminalHeight,
      )

      // Terminal label
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(terminal.name, terminal.x * canvas.width, terminal.y * canvas.height + 5)
    })

    // Draw taxiways
    ctx.lineWidth = 10
    ctx.strokeStyle = "#6b7280"

    // Connect terminals with taxiways
    for (let i = 0; i < terminalPositions.length; i++) {
      for (let j = i + 1; j < terminalPositions.length; j++) {
        ctx.beginPath()
        ctx.moveTo(terminalPositions[i].x * canvas.width, terminalPositions[i].y * canvas.height)
        ctx.lineTo(terminalPositions[j].x * canvas.width, terminalPositions[j].y * canvas.height)
        ctx.stroke()
      }
    }

    // Draw equipment positions
    const positions = getEquipmentPositions()
    positions.forEach((pos) => {
      // Draw equipment marker
      ctx.beginPath()
      
      // Use different shapes for powered vs non-powered equipment
      if (pos.equipment.category === "Non-Powered Equipment") {
        // Draw square for non-powered equipment
        const size = pos.radius * 1.8
        ctx.rect(
          pos.x * canvas.width - size/2, 
          pos.y * canvas.height - size/2, 
          size, 
          size
        )
      } else {
        // Draw circle for powered equipment
        ctx.arc(pos.x * canvas.width, pos.y * canvas.height, pos.radius, 0, 2 * Math.PI)
      }

      // Color based on status and certification
      if (pos.equipment.status === "Available") {
        if (hasCertification(pos.equipment.certificationRequired)) {
          ctx.fillStyle = "#10b981" // Green for available and certified
        } else {
          ctx.fillStyle = "#f59e0b" // Amber for available but not certified
        }
      } else if (pos.equipment.status === "Maintenance") {
        ctx.fillStyle = "#ef4444" // Red for maintenance
      } else {
        ctx.fillStyle = "#6b7280" // Gray for in use
      }

      // Highlight if hovered
      if (hoveredEquipment === pos.equipment) {
        ctx.lineWidth = 3
        ctx.strokeStyle = "#2563eb"
        ctx.stroke()
      }

      // Fill the shape
      ctx.fill()

      // Draw equipment code
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(pos.equipment.code.substring(0, 2), pos.x * canvas.width, pos.y * canvas.height)
    })

    // Draw user position
    ctx.beginPath()
    ctx.arc(0.5 * canvas.width, 0.5 * canvas.height, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#3b82f6" // Blue for user
    ctx.fill()

    // Add pulsing effect to user position
    ctx.beginPath()
    ctx.arc(0.5 * canvas.width, 0.5 * canvas.height, 12, 0, 2 * Math.PI)
    ctx.lineWidth = 2
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
    ctx.stroke()

    // Add "You are here" label
    ctx.fillStyle = "#1f2937"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("You are here", 0.5 * canvas.width, 0.5 * canvas.height + 20)

    // Handle mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / canvas.width
      const y = (e.clientY - rect.top) / canvas.height

      // Check if mouse is over any equipment
      const hovered = positions.find((pos) => {
        if (pos.equipment.category === "Non-Powered Equipment") {
          // Square hit detection for non-powered equipment
          const size = pos.radius * 1.8
          const halfSize = size / 2
          const equipX = pos.x * canvas.width
          const equipY = pos.y * canvas.height
          const mouseX = x * canvas.width
          const mouseY = y * canvas.height
          
          return (
            mouseX >= equipX - halfSize &&
            mouseX <= equipX + halfSize &&
            mouseY >= equipY - halfSize &&
            mouseY <= equipY + halfSize
          )
        } else {
          // Circle hit detection for powered equipment
          const dx = pos.x * canvas.width - x * canvas.width
          const dy = pos.y * canvas.height - y * canvas.height
          return Math.sqrt(dx * dx + dy * dy) <= pos.radius
        }
      })

      setHoveredEquipment(hovered ? hovered.equipment : null)
      canvas.style.cursor = hovered ? "pointer" : "default"
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / canvas.width
      const y = (e.clientY - rect.top) / canvas.height

      // Check if click is on any equipment
      const clicked = positions.find((pos) => {
        if (pos.equipment.category === "Non-Powered Equipment") {
          // Square hit detection for non-powered equipment
          const size = pos.radius * 1.8
          const halfSize = size / 2
          const equipX = pos.x * canvas.width
          const equipY = pos.y * canvas.height
          const mouseX = x * canvas.width
          const mouseY = y * canvas.height
          
          return (
            mouseX >= equipX - halfSize &&
            mouseX <= equipX + halfSize &&
            mouseY >= equipY - halfSize &&
            mouseY <= equipY + halfSize
          )
        } else {
          // Circle hit detection for powered equipment
          const dx = pos.x * canvas.width - x * canvas.width
          const dy = pos.y * canvas.height - y * canvas.height
          return Math.sqrt(dx * dx + dy * dy) <= pos.radius
        }
      })

      if (clicked) {
        setSelectedEquipment(clicked.equipment)
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [equipment, canvasSize, hoveredEquipment, userCertifications])

  const handleCheckout = (equipmentId: string) => {
    router.push(`/equipment/checkout/${equipmentId}`)
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-2 left-2 z-10 bg-gray-800 text-white p-3 rounded-md text-sm">
        <div className="font-bold">YYZ Airport Map</div>
        <div className="text-xs text-gray-300">Showing {equipment.length} equipment items</div>
      </div>

      <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white p-3 rounded-md text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs">Available & Certified</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs">Certification Required</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-xs">In Use</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          <span className="text-xs">Non-Powered Equipment</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="h-full w-full rounded-lg"></canvas>

      {hoveredEquipment && !selectedEquipment && (
        <div
          className="absolute bg-gray-800 text-white p-3 rounded-md shadow-md text-sm z-20"
          style={{
            top: `${hoveredEquipment.id.charCodeAt(0) % 80}%`,
            left: `${hoveredEquipment.id.charCodeAt(1) % 80}%`,
          }}
        >
          <div className="font-bold">{hoveredEquipment.type}</div>
          <div>{hoveredEquipment.id}</div>
          <div className="text-xs text-gray-300">{hoveredEquipment.category}</div>
          <div className="flex items-center gap-1">
            {hasCertification(hoveredEquipment.certificationRequired) ? (
              <>
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span className="text-green-400">Certified</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                <span className="text-amber-400">Certification Required</span>
              </>
            )}
          </div>
          <div
            className={
              hoveredEquipment.status === "Available"
                ? "text-green-400"
                : hoveredEquipment.status === "Maintenance"
                  ? "text-red-400"
                  : "text-gray-300"
            }
          >
            {hoveredEquipment.status}
          </div>
        </div>
      )}

      {selectedEquipment && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 bg-opacity-80">
          <Card className="border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-\
\
\
\
