"use client"

import { useState, useEffect } from "react"
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

interface EditEquipmentTypeModalProps {
  equipment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEquipmentTypeModal({ equipment, open, onOpenChange }: EditEquipmentTypeModalProps) {
  const { updateEquipmentType } = useData()

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

  useEffect(() => {
    if (equipment) {
      // Map equipment data to form fields
      setFormData({
        typeName: equipment.label || "",
        typeId: equipment.value || "",
        category: equipment.category || "",
        isPowered: equipment.isPowered || false,
        maintenanceInterval: equipment.maintenanceInterval?.toString() || "90",
        requiredCertification:
          equipment.requiredCertification === "Basic GSE"
            ? "basic"
            : equipment.requiredCertification === "Heavy Equipment"
              ? "heavy"
              : equipment.requiredCertification === "Lifting Equipment"
                ? "lifting"
                : equipment.requiredCertification === "Specialized Equipment"
                  ? "specialized"
                  : "none",
        description: equipment.description || "",
      })
    }
  }, [equipment])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Create updated equipment type object
    const updatedEquipmentType = {
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
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    // Update in context
    updateEquipmentType(formData.typeId, updatedEquipmentType)

    toast({
      title: "Equipment Type Updated",
      description: `Equipment type "${formData.typeName}" has been successfully updated.`,
    })

    setIsSubmitting(false)
    onOpenChange(false)
  }

  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Equipment Type</DialogTitle>
          <DialogDescription>Update equipment type specifications</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="typeName">Type Name *</Label>
            <Input
              id="typeName"
              value={formData.typeName}
              onChange={(e) => handleChange("typeName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeId">Type ID *</Label>
            <Input
              id="typeId"
              value={formData.typeId}
              onChange={(e) => handleChange("typeId", e.target.value)}
              disabled
            />
            <p className="text-xs text-muted-foreground">Type ID cannot be changed after creation</p>
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
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
