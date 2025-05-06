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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useData } from "@/context/data-context"

interface AddEquipmentTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEquipmentTypeModal({ open, onOpenChange }: AddEquipmentTypeModalProps) {
  const { addEquipmentType } = useData()

  const [formData, setFormData] = useState({
    typeName: "",
    typeId: "",
    category: "",
    isPowered: true,
    maintenanceInterval: "90",
    requiredCertification: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Create new equipment type object
    const newEquipmentType = {
      value: formData.typeId,
      label: formData.typeName,
      isPowered: formData.isPowered,
      maintenanceInterval: Number.parseInt(formData.maintenanceInterval),
      requiredCertification:
        formData.requiredCertification === "basic"
          ? "Basic GSE"
          : formData.requiredCertification === "heavy"
            ? "Heavy Equipment"
            : formData.requiredCertification === "lifting"
              ? "Lifting Equipment"
              : formData.requiredCertification === "specialized"
                ? "Specialized Equipment"
                : "None",
      category: formData.category,
      description: formData.description,
      activeUnits: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    // Add to context
    addEquipmentType(newEquipmentType)

    toast({
      title: "Equipment Type Added",
      description: `Equipment type "${formData.typeName}" has been successfully added.`,
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      typeName: "",
      typeId: "",
      category: "",
      isPowered: true,
      maintenanceInterval: "90",
      requiredCertification: "",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Equipment Type</DialogTitle>
          <DialogDescription>Create a new equipment type with specifications</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="typeName">Type Name *</Label>
            <Input
              id="typeName"
              value={formData.typeName}
              onChange={(e) => handleChange("typeName", e.target.value)}
              placeholder="e.g., Baggage Tractor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeId">Type ID *</Label>
            <Input
              id="typeId"
              value={formData.typeId}
              onChange={(e) => handleChange("typeId", e.target.value)}
              placeholder="e.g., baggage-tractor"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use lowercase with hyphens, no spaces. This will be used as an identifier in the system.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="towing">Towing Equipment</SelectItem>
                <SelectItem value="loading">Loading Equipment</SelectItem>
                <SelectItem value="support">Support Equipment</SelectItem>
                <SelectItem value="service">Service Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPowered">Powered Equipment</Label>
              <p className="text-xs text-muted-foreground">Powered equipment requires fuel/battery and has an engine</p>
            </div>
            <Switch
              id="isPowered"
              checked={formData.isPowered}
              onCheckedChange={(checked) => handleChange("isPowered", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceInterval">Maintenance Interval (Days) *</Label>
            <Input
              id="maintenanceInterval"
              type="number"
              min="1"
              max="365"
              value={formData.maintenanceInterval}
              onChange={(e) => handleChange("maintenanceInterval", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredCertification">Required Certification</Label>
            <Select
              value={formData.requiredCertification}
              onValueChange={(value) => handleChange("requiredCertification", value)}
            >
              <SelectTrigger id="requiredCertification">
                <SelectValue placeholder="Select required certification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="basic">Basic GSE</SelectItem>
                <SelectItem value="heavy">Heavy Equipment</SelectItem>
                <SelectItem value="lifting">Lifting Equipment</SelectItem>
                <SelectItem value="specialized">Specialized Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of this equipment type"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Equipment Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
