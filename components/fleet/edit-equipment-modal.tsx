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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface EditEquipmentModalProps {
  equipment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEquipmentModal({ equipment, open, onOpenChange }: EditEquipmentModalProps) {
  const [formData, setFormData] = useState(equipment || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!equipment) return null

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Equipment Updated",
      description: `Equipment ${formData.id} has been successfully updated.`,
    })

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Equipment {equipment.id}</DialogTitle>
          <DialogDescription>Update equipment details, specifications, and sensor information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="sensors">Sensors & Telematics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.distance || ""}
                  onChange={(e) => handleChange("distance", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance || ""}
                  onChange={(e) => handleChange("lastMaintenance", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance || ""}
                  onChange={(e) => handleChange("nextMaintenance", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer || ""}
                  onChange={(e) => handleChange("manufacturer", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ""}
                  onChange={(e) => handleChange("model", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={formData.year || ""} onChange={(e) => handleChange("year", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber || ""}
                  onChange={(e) => handleChange("serialNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="powerType">Power Type</Label>
                <Select value={formData.powerType || ""} onValueChange={(value) => handleChange("powerType", value)}>
                  <SelectTrigger id="powerType">
                    <SelectValue placeholder="Select power type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  value={formData.maxCapacity || ""}
                  onChange={(e) => handleChange("maxCapacity", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="telematicsDevice"
                    checked={formData.telematicsDevice || false}
                    onCheckedChange={(checked) => handleChange("telematicsDevice", checked)}
                  />
                  <Label htmlFor="telematicsDevice">Telematics Device</Label>
                </div>
                {formData.telematicsDevice && (
                  <div className="pl-6">
                    <Label htmlFor="telematicsSerial">Serial Number</Label>
                    <Input
                      id="telematicsSerial"
                      value={formData.telematicsSerial || ""}
                      onChange={(e) => handleChange("telematicsSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bleBeacon"
                    checked={formData.bleBeacon || false}
                    onCheckedChange={(checked) => handleChange("bleBeacon", checked)}
                  />
                  <Label htmlFor="bleBeacon">BLE Beacon</Label>
                </div>
                {formData.bleBeacon && (
                  <div className="pl-6">
                    <Label htmlFor="bleSerial">Serial Number</Label>
                    <Input
                      id="bleSerial"
                      value={formData.bleSerial || ""}
                      onChange={(e) => handleChange("bleSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="levelSensor"
                    checked={formData.levelSensor || false}
                    onCheckedChange={(checked) => handleChange("levelSensor", checked)}
                  />
                  <Label htmlFor="levelSensor">Level Sensor</Label>
                </div>
                {formData.levelSensor && (
                  <div className="pl-6">
                    <Label htmlFor="levelSensorSerial">Serial Number</Label>
                    <Input
                      id="levelSensorSerial"
                      value={formData.levelSensorSerial || ""}
                      onChange={(e) => handleChange("levelSensorSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tempSensor"
                    checked={formData.tempSensor || false}
                    onCheckedChange={(checked) => handleChange("tempSensor", checked)}
                  />
                  <Label htmlFor="tempSensor">Temperature Sensor</Label>
                </div>
                {formData.tempSensor && (
                  <div className="pl-6">
                    <Label htmlFor="tempSensorSerial">Serial Number</Label>
                    <Input
                      id="tempSensorSerial"
                      value={formData.tempSensorSerial || ""}
                      onChange={(e) => handleChange("tempSensorSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aiDashcam"
                    checked={formData.aiDashcam || false}
                    onCheckedChange={(checked) => handleChange("aiDashcam", checked)}
                  />
                  <Label htmlFor="aiDashcam">AI Dashcam</Label>
                </div>
                {formData.aiDashcam && (
                  <div className="pl-6">
                    <Label htmlFor="aiDashcamSerial">Serial Number</Label>
                    <Input
                      id="aiDashcamSerial"
                      value={formData.aiDashcamSerial || ""}
                      onChange={(e) => handleChange("aiDashcamSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cameras"
                    checked={formData.cameras || false}
                    onCheckedChange={(checked) => handleChange("cameras", checked)}
                  />
                  <Label htmlFor="cameras">Cameras</Label>
                </div>
                {formData.cameras && (
                  <div className="pl-6">
                    <Label htmlFor="camerasSerial">Serial Number</Label>
                    <Input
                      id="camerasSerial"
                      value={formData.camerasSerial || ""}
                      onChange={(e) => handleChange("camerasSerial", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
