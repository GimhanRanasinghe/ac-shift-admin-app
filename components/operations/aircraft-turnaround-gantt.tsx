"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react"

// Define types for turnaround activities
interface TurnaroundActivity {
  id: string
  name: string
  start: number // minutes from arrival
  duration: number // in minutes
  status: "completed" | "in-progress" | "scheduled" | "delayed"
  assignedTo?: string
  dependencies?: string[] // IDs of activities that must be completed before this one
  equipment?: string[] // IDs of equipment required
}

interface Aircraft {
  id: string
  flight: string
  type: string
  registration: string
  arrival: string
  departure: string
  gate: string
  activities: TurnaroundActivity[]
}

// Mock data - in a real app, this would come from an API
const mockAircraft: Aircraft[] = [
  {
    id: "ac-123",
    flight: "AC123",
    type: "Boeing 787-9",
    registration: "C-FGDT",
    arrival: "2023-04-17T14:00:00Z",
    departure: "2023-04-17T16:30:00Z",
    gate: "A1",
    activities: [
      {
        id: "act-1",
        name: "Deboarding",
        start: 5,
        duration: 25,
        status: "completed",
        assignedTo: "Ground Crew A",
      },
      {
        id: "act-2",
        name: "Catering",
        start: 15,
        duration: 45,
        status: "completed",
        assignedTo: "Catering Team B",
        dependencies: ["act-1"],
        equipment: ["catering-truck-1"],
      },
      {
        id: "act-3",
        name: "Cleaning",
        start: 20,
        duration: 40,
        status: "in-progress",
        assignedTo: "Cleaning Team C",
        dependencies: ["act-1"],
      },
      {
        id: "act-4",
        name: "Fueling",
        start: 30,
        duration: 35,
        status: "scheduled",
        equipment: ["fuel-truck-2"],
      },
      {
        id: "act-5",
        name: "Baggage Unloading",
        start: 10,
        duration: 30,
        status: "completed",
        assignedTo: "Baggage Team A",
        equipment: ["baggage-tractor-3", "baggage-cart-7"],
      },
      {
        id: "act-6",
        name: "Baggage Loading",
        start: 70,
        duration: 35,
        status: "scheduled",
        assignedTo: "Baggage Team B",
        dependencies: ["act-5"],
        equipment: ["baggage-tractor-4", "baggage-cart-9"],
      },
      {
        id: "act-7",
        name: "Boarding",
        start: 95,
        duration: 40,
        status: "scheduled",
        dependencies: ["act-2", "act-3", "act-4"],
      },
      {
        id: "act-8",
        name: "Pushback",
        start: 140,
        duration: 10,
        status: "scheduled",
        dependencies: ["act-7", "act-6"],
        equipment: ["pushback-tug-2"],
      },
    ],
  },
  {
    id: "ac-456",
    flight: "AC456",
    type: "Airbus A320",
    registration: "C-FTJP",
    arrival: "2023-04-17T13:30:00Z",
    departure: "2023-04-17T15:00:00Z",
    gate: "C2",
    activities: [
      {
        id: "act-21",
        name: "Deboarding",
        start: 5,
        duration: 20,
        status: "completed",
        assignedTo: "Ground Crew B",
      },
      {
        id: "act-22",
        name: "Catering",
        start: 15,
        duration: 30,
        status: "completed",
        assignedTo: "Catering Team A",
        dependencies: ["act-21"],
        equipment: ["catering-truck-3"],
      },
      {
        id: "act-23",
        name: "Cleaning",
        start: 20,
        duration: 25,
        status: "completed",
        assignedTo: "Cleaning Team B",
        dependencies: ["act-21"],
      },
      {
        id: "act-24",
        name: "Fueling",
        start: 25,
        duration: 20,
        status: "completed",
        equipment: ["fuel-truck-1"],
      },
      {
        id: "act-25",
        name: "Baggage Unloading",
        start: 10,
        duration: 20,
        status: "completed",
        assignedTo: "Baggage Team C",
        equipment: ["baggage-tractor-1", "baggage-cart-3"],
      },
      {
        id: "act-26",
        name: "Baggage Loading",
        start: 40,
        duration: 25,
        status: "completed",
        assignedTo: "Baggage Team C",
        dependencies: ["act-25"],
        equipment: ["baggage-tractor-1", "baggage-cart-4"],
      },
      {
        id: "act-27",
        name: "Boarding",
        start: 55,
        duration: 25,
        status: "in-progress",
        dependencies: ["act-22", "act-23", "act-24"],
      },
      {
        id: "act-28",
        name: "Pushback",
        start: 85,
        duration: 5,
        status: "scheduled",
        dependencies: ["act-27", "act-26"],
        equipment: ["pushback-tug-1"],
      },
    ],
  },
]

export default function AircraftTurnaroundGantt() {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>(mockAircraft[0])
  const [timeScale, setTimeScale] = useState<'15min' | '30min' | '1hour'>('15min')
  const [view, setView] = useState<'gantt' | 'list'>('gantt')
  
  // Calculate the total turnaround time in minutes
  const calculateTurnaroundTime = (aircraft: Aircraft) => {
    const lastActivity = [...aircraft.activities].sort((a, b) => {
      return (b.start + b.duration) - (a.start + a.duration)
    })[0]
    return lastActivity.start + lastActivity.duration
  }
  
  const turnaroundTime = calculateTurnaroundTime(selectedAircraft)
  
  // Calculate time slots based on the selected time scale
  const getTimeSlots = () => {
    const interval = timeScale === '15min' ? 15 : timeScale === '30min' ? 30 : 60
    const slots = []
    for (let i = 0; i <= turnaroundTime; i += interval) {
      slots.push(i)
    }
    return slots
  }
  
  const timeSlots = getTimeSlots()
  
  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`
  }
  
  // Calculate the arrival time plus minutes
  const getTimeFromArrival = (arrivalTime: string, minutesAfter: number) => {
    const arrival = new Date(arrivalTime)
    return new Date(arrival.getTime() + minutesAfter * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get status color
  const getStatusColor = (status: TurnaroundActivity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'scheduled':
        return 'bg-gray-500'
      case 'delayed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  // Get status icon
  const getStatusIcon = (status: TurnaroundActivity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Aircraft Turnaround</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedAircraft.id}
              onValueChange={(value) => {
                const aircraft = mockAircraft.find(a => a.id === value)
                if (aircraft) setSelectedAircraft(aircraft)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select flight" />
              </SelectTrigger>
              <SelectContent>
                {mockAircraft.map((aircraft) => (
                  <SelectItem key={aircraft.id} value={aircraft.id}>
                    {aircraft.flight} - {aircraft.gate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={view} onValueChange={(v) => setView(v as 'gantt' | 'list')}>
              <TabsList>
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
          <div>
            <p className="text-sm font-medium">{selectedAircraft.flight} - {selectedAircraft.type}</p>
            <p className="text-sm text-gray-500">
              {new Date(selectedAircraft.arrival).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })} - {new Date(selectedAircraft.departure).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })} | Gate {selectedAircraft.gate}
            </p>
          \
\
