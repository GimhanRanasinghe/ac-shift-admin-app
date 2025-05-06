"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Calendar } from "lucide-react"
import { FlightList } from "@/components/flights/flight-list"

// Import flight data
import flightsData from "@/data/flights.json"

// Create a full 8-hour shift of assignments
const createShiftAssignments = () => {
  // Base flight data
  const baseFlights = flightsData.map((flight) => ({ ...flight }))

  // Task types
  const taskTypes = ["loading", "unloading", "pushback", "catering", "fueling"]

  // Create a timeline of flights for today (8-hour shift)
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Start shift 4 hours ago and end 4 hours from now (or use actual time if in middle of day)
  const shiftStartHour = Math.max(8, currentHour - 4)

  const todayFlights = []

  // Create 8 flights spread across an 8-hour shift
  for (let i = 0; i < 8; i++) {
    const hourOffset = i
    const flightHour = shiftStartHour + hourOffset
    const flightMinute = i % 2 === 0 ? 15 : 45

    // Create flight time
    const flightTime = new Date()
    flightTime.setHours(flightHour, flightMinute, 0)

    // Determine if flight has departed
    // Force the first 3 flights to be departed, the 4th to be current, and the rest upcoming
    let isDeparted = false
    let isCurrent = false

    if (i < 3) {
      isDeparted = true
      isCurrent = false
    } else if (i === 3) {
      isDeparted = false
      isCurrent = true
    } else {
      isDeparted = false
      isCurrent = false
    }

    // Calculate progress percentage for timeline
    let progressPercent = 0
    if (isCurrent) {
      // For the current flight, set progress to exactly 45%
      progressPercent = 45
    } else if (isDeparted) {
      progressPercent = 100
    } else {
      // For future flights, calculate based on time
      const totalMinutes = flightHour * 60 + flightMinute
      const currentTotalMinutes = currentHour * 60 + currentMinute
      const remainingMinutes = totalMinutes - currentTotalMinutes

      // Assume we start tracking 90 minutes before departure
      const totalTrackingMinutes = 90
      progressPercent = Math.max(0, Math.min(100, 100 - (remainingMinutes / totalTrackingMinutes) * 100))
    }

    todayFlights.push({
      id: `today-${i + 1}`,
      flight: `AC${Math.floor(Math.random() * 900) + 100}`,
      origin: "YYZ",
      destination: baseFlights[i % baseFlights.length].destination,
      scheduledDeparture: `${flightHour.toString().padStart(2, "0")}:${flightMinute.toString().padStart(2, "0")}`,
      actualDeparture: `${flightHour.toString().padStart(2, "0")}:${flightMinute.toString().padStart(2, "0")}`,
      gate: `${String.fromCharCode(65 + (i % 6))}${Math.floor(Math.random() * 20) + 1}`,
      terminal: (i % 3) + 1,
      aircraft: baseFlights[i % baseFlights.length].aircraft,
      status: isDeparted ? "Departed" : "On Time",
      date: "Today",
      task: taskTypes[i % taskTypes.length],
      isDeparted,
      progressPercent,
      isCurrent,
    })
  }

  // Create tomorrow's flights
  const tomorrowFlights = baseFlights
    .filter((flight) => flight.date === "Tomorrow")
    .map((flight, i) => ({
      ...flight,
      id: `tomorrow-${i + 1}`,
      task: taskTypes[i % taskTypes.length],
      isDeparted: false,
      progressPercent: 0,
      isCurrent: false,
    }))

  return [...todayFlights, ...tomorrowFlights]
}

// Create the shift assignments
const flightsWithTasks = createShiftAssignments()

export default function Flights() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter flights based on search
  const filteredFlights = flightsWithTasks.filter(
    (flight) =>
      flight.flight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.gate.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group flights by date
  const todayFlights = filteredFlights.filter((flight) => flight.date === "Today")
  const tomorrowFlights = filteredFlights.filter((flight) => flight.date === "Tomorrow")

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Flights</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search flights by number, destination, or gate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border text-card-foreground rounded-2xl"
          />
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-muted rounded-2xl">
            <TabsTrigger value="today" className="data-[state=active]:bg-aircanada-blue rounded-2xl">
              <Clock className="h-4 w-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="tomorrow" className="data-[state=active]:bg-aircanada-blue rounded-2xl">
              <Calendar className="h-4 w-4 mr-2" />
              Tomorrow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <FlightList flights={todayFlights} />
          </TabsContent>

          <TabsContent value="tomorrow" className="space-y-4">
            <FlightList flights={tomorrowFlights} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
