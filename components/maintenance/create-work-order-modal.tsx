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
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { maintenanceService, CreateMaintenanceTaskPayload } from "@/lib/services/maintenance-service"

// Import sample data
import userData from "@/data/user.json"
import equipmentData from "@/data/equipment.json"

// Create sample users data
const users = [
  { id: 1, name: userData.name, employeeId: userData.employeeId },
  { id: 2, name: "Sarah Johnson", employeeId: "AC234567" },
  { id: 3, name: "Michael Brown", employeeId: "AC345678" },
  { id: 4, name: "Emily Davis", employeeId: "AC456789" },
  { id: 5, name: "David Wilson", employeeId: "AC567890" },
]

// Maintenance types
const maintenanceTypes = [
  "Routine Inspection",
  "Oil Change",
  "Filter Replacement",
  "Battery Replacement",
  "Brake Service",
  "Tire Rotation",
  "Engine Repair",
  "Electrical System",
  "Hydraulic System",
  "Structural Repair",
]

// Priority levels
const priorityLevels = ["High", "Medium", "Low"]

interface CreateWorkOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWorkOrderModal({ open, onOpenChange }: CreateWorkOrderModalProps) {
  // Get toast function
  const { toast } = useToast()
  
  // Form state
  const [formData, setFormData] = useState({
    equipment_id: 0,
    maintenance_type: "",
    description: "",
    assigned_to: 0,
    status: "unassigned",
    priority: "Medium",
    type: "scheduled", // Constant as specified
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

    try {
      // Create payload
      const payload: CreateMaintenanceTaskPayload = {
        equipment_id: formData.equipment_id,
        maintenance_type: formData.maintenance_type,
        status: formData.status,
        priority: formData.priority,
        type: formData.type,
        due_date: formData.start_time.toISOString(),
        assigned_to: formData.assigned_to || null,
        description: formData.description,
        notes: "",
      }

      console.log("Work order payload:", payload)

      // Call the maintenance service to create the work order
      const response = await maintenanceService.create(payload)
      
      console.log("Work order created:", response)

      toast({
        title: "Work Order Created",
        description: "The new work order has been successfully created.",
      })

      setIsSubmitting(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating work order:", error)
      
      toast({
        title: "Error",
        description: "Failed to create work order. Please try again.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Work Order</DialogTitle>
          <DialogDescription>
            Create a new maintenance work order for equipment. Fill out all required fields.
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

          {/* Maintenance Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maintenanceType" className="text-right">
              Maintenance Type
            </Label>
            <Select
              value={formData.maintenance_type}
              onValueChange={(value) => handleChange("maintenance_type", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              placeholder="Enter work order description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Assigned To */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assigned To
            </Label>
            <Select
              value={formData.assigned_to ? formData.assigned_to.toString() : ""}
              onValueChange={(value) => handleChange("assigned_to", parseInt(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.employeeId})
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
            {isSubmitting ? "Creating..." : "Create Work Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
