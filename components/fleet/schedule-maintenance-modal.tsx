"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ScheduleMaintenanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample equipment data for dropdown
const equipmentOptions = [
  { id: "BTG-1045", type: "Baggage Tractor" },
  { id: "BLW-0872", type: "Belt Loader" },
  { id: "ATF-0023", type: "Pushback Tractor" },
  { id: "GPB-0789", type: "Ground Power Unit" },
  { id: "CLS-0456", type: "Container Loader" },
  { id: "LTL-0234", type: "Lavatory Truck" },
]

// Sample technicians data for dropdown
const technicianOptions = [
  { id: "tech-1", name: "John Smith" },
  { id: "tech-2", name: "Sarah Johnson" },
  { id: "tech-3", name: "Mike Davis" },
  { id: "tech-4", name: "Emily Wilson" },
  { id: "tech-5", name: "Alex Johnson" },
  { id: "tech-6", name: "Maria Rodriguez" },
]

export function ScheduleMaintenanceModal({ open, onOpenChange }: ScheduleMaintenanceModalProps) {
  const [formData, setFormData] = useState({
    equipmentId: "",
    maintenanceType: "Scheduled",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    estimatedDuration: "2",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance for ${formData.equipmentId} has been scheduled for ${formData.dueDate}.`,
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      equipmentId: "",
      maintenanceType: "Scheduled",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      estimatedDuration: "2",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Maintenance</DialogTitle>
          <DialogDescription>Create a new maintenance task for equipment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="equipmentId">Equipment *</Label>
            <Select value={formData.equipmentId} onValueChange={(value) => handleChange("equipmentId", value)} required>
              <SelectTrigger id="equipmentId">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.id} - {equipment.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceType">Maintenance Type *</Label>
            <Select
              value={formData.maintenanceType}
              onValueChange={(value) => handleChange("maintenanceType", value)}
              required
            >
              <SelectTrigger id="maintenanceType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)} required>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select value={formData.assignedTo} onValueChange={(value) => handleChange("assignedTo", value)}>
              <SelectTrigger id="assignedTo">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {technicianOptions.map((tech) => (
                  <SelectItem key={tech.id} value={tech.name}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Estimated Duration (Hours) *</Label>
            <Input
              id="estimatedDuration"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.estimatedDuration}
              onChange={(e) => handleChange("estimatedDuration", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter maintenance details and instructions"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Maintenance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
