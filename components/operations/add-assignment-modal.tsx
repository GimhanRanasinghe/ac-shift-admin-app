"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Import sample data
import userData from "@/data/user.json"
import equipmentData from "@/data/equipment.json"

// Create sample users data
const users = [
  { id: 1, name: userData.name, employeeId: userData.employeeId },
  { id: 3, name: "Sarah Johnson", employeeId: "AC234567" },
  { id: 4, name: "Michael Brown", employeeId: "AC345678" },
  { id: 7, name: "Emily Davis", employeeId: "AC456789" },
  { id: 6, name: "David Wilson", employeeId: "AC567890" },
]

// Create sample flights data
const flights = [
  { id: 1, flightNumber: "AC123", destination: "Toronto to Vancouver" },
  { id: 2, flightNumber: "AC456", destination: "Toronto to Montreal" },
  { id: 3, flightNumber: "AC789", destination: "Toronto to Calgary" },
  { id: 4, flightNumber: "AC234", destination: "Toronto to Halifax" },
  { id: 5, flightNumber: "AC567", destination: "Toronto to Edmonton" },
]

// Create sample gates data
const gates = [
  { id: 1, gate: "A1", terminal: "Terminal 1" },
  { id: 2, gate: "A2", terminal: "Terminal 1" },
  { id: 3, gate: "B1", terminal: "Terminal 1" },
  { id: 4, gate: "B2", terminal: "Terminal 1" },
  { id: 5, gate: "C1", terminal: "Terminal 3" },
]

// Task types
const taskTypes = [
  "Baggage Handling",
  "Aircraft Pushback",
  "Lavatory Service",
  "Water Service",
  "Catering",
  "Fueling",
  "De-icing",
  "Cabin Cleaning",
  "Ground Power",
]

// Priority levels
const priorityLevels = ["High", "Medium", "Low"]

interface AddAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAssignmentModal({ open, onOpenChange }: AddAssignmentModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    equipment_id: 0,
    assigned_to: 0,
    flight_id: 0,
    gate_id: 0,
    task_type: "",
    priority: "",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // Default to 2 hours later
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Create payload
    const payload = {
      equipment_id: formData.equipment_id,
      assigned_to: formData.assigned_to,
      flight_id: formData.flight_id,
      gate_id: formData.gate_id,
      task_type: formData.task_type,
      priority: formData.priority,
      start_time: formData.start_time.toISOString(),
      end_time: formData.end_time.toISOString(),
    }

    console.log("Assignment payload:", payload)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Assignment Created",
      description: "The new assignment has been successfully created.",
    })

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Assign equipment and operators to tasks. Fill out all fields to create a new assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Equipment Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="equipment" className="text-right">
              Equipment
            </Label>
            <Select
              value={formData.equipment_id ? formData.equipment_id.toString() : ""}
              onValueChange={(value) => handleChange("equipment_id", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentData.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.type} ({equipment.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operator" className="text-right">
              Operator
            </Label>
            <Select
              value={formData.assigned_to ? formData.assigned_to.toString() : ""}
              onValueChange={(value) => handleChange("assigned_to", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Flight Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="flight" className="text-right">
              Flight
            </Label>
            <Select
              value={formData.flight_id ? formData.flight_id.toString() : ""}
              onValueChange={(value) => handleChange("flight_id", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select flight" />
              </SelectTrigger>
              <SelectContent>
                {flights.map((flight) => (
                  <SelectItem key={flight.id} value={flight.id.toString()}>
                    {flight.flightNumber} ({flight.destination})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gate Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gate" className="text-right">
              Gate
            </Label>
            <Select
              value={formData.gate_id ? formData.gate_id.toString() : ""}
              onValueChange={(value) => handleChange("gate_id", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gate" />
              </SelectTrigger>
              <SelectContent>
                {gates.map((gate) => (
                  <SelectItem key={gate.id} value={gate.id.toString()}>
                    {gate.gate} ({gate.terminal})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskType" className="text-right">
              Task Type
            </Label>
            <Select
              value={formData.task_type}
              onValueChange={(value) => handleChange("task_type", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleChange("priority", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_time && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_time ? format(formData.start_time, "PPP 'at' h:mm a") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_time}
                    onSelect={(date) => date && handleChange("start_time", date)}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="startTimeInput">Select Time</Label>
                      <Input
                        id="startTimeInput"
                        type="time"
                        value={format(formData.start_time, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(formData.start_time);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          handleChange("start_time", newDate);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* End Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_time && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_time ? format(formData.end_time, "PPP 'at' h:mm a") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.end_time}
                    onSelect={(date) => date && handleChange("end_time", date)}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="endTimeInput">Select Time</Label>
                      <Input
                        id="endTimeInput"
                        type="time"
                        value={format(formData.end_time, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(formData.end_time);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          handleChange("end_time", newDate);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
