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
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/context/data-context"
import { generateEquipmentId } from "@/utils/use-id-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface AddEquipmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEquipmentModal({ open, onOpenChange }: AddEquipmentModalProps) {
  const { equipmentTypes, addEquipment } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Basic info state
  const [equipmentType, setEquipmentType] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")

  // Location state
  const [location, setLocation] = useState({ lat: 43.6777, lng: -79.6248 }) // Default YYZ coordinates

  // Status state
  const [status, setStatus] = useState("Available")
  const [fuelLevel, setFuelLevel] = useState("100%")
  const [batteryLevel, setBatteryLevel] = useState("100%")

  // Sensors state
  const [sensors, setSensors] = useState({
    telematicsDevice: false,
    telematicsSerial: "",
    bleBeacon: false,
    bleSerial: "",
    levelSensor: false,
    levelSensorSerial: "",
    tempSensor: false,
    tempSensorSerial: "",
    aiDashcam: false,
    aiDashcamSerial: "",
    cameras: false,
    camerasSerial: "",
    // Add sensor package information
    sensorPackage: "",
    packageInstallDate: "",
    packageWarrantyExpiration: "",
    packageFirmwareVersion: "",
  })

  // Get the selected equipment type details
  const selectedType = equipmentTypes.find((type) => type.value === equipmentType)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Generate a unique ID based on the equipment type
      const typeCode = equipmentType.substring(0, 3)
      const id = generateEquipmentId(typeCode)

      // Get the equipment type label
      const typeLabel = selectedType?.label || "Unknown Equipment"

      // Get the category from the selected type
      const category = selectedType?.category || "support"

      // Create the new equipment object
      const newEquipment = {
        id,
        type: typeLabel,
        category,
        code: equipmentType,
        powerType: selectedType?.isPowered ? "Powered" : "Non-powered",
        aircraftCompatibility: "All",
        location,
        distance: "0.5 km",
        status,
        lastUsed: new Date().toISOString().split("T")[0],
        fuelLevel: selectedType?.isPowered ? fuelLevel : null,
        batteryLevel: selectedType?.isPowered ? batteryLevel : null,
        lastMaintenance: new Date().toISOString().split("T")[0],
        nextMaintenance: (() => {
          const date = new Date()
          date.setDate(date.getDate() + (selectedType?.maintenanceInterval || 90))
          return date.toISOString().split("T")[0]
        })(),
        certificationRequired: selectedType?.requiredCertification || "Basic GSE",
        manufacturer,
        model,
        serialNumber,
        year,
        description,
        sensors,
      }

      // Add the new equipment to the data context
      addEquipment(newEquipment)

      // Reset form and close modal
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding equipment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEquipmentType("")
    setManufacturer("")
    setModel("")
    setSerialNumber("")
    setYear("")
    setDescription("")
    setLocation({ lat: 43.6777, lng: -79.6248 })
    setStatus("Available")
    setFuelLevel("100%")
    setBatteryLevel("100%")
    setSensors({
      telematicsDevice: false,
      telematicsSerial: "",
      bleBeacon: false,
      bleSerial: "",
      levelSensor: false,
      levelSensorSerial: "",
      tempSensor: false,
      tempSensorSerial: "",
      aiDashcam: false,
      aiDashcamSerial: "",
      cameras: false,
      camerasSerial: "",
      // Reset sensor package information
      sensorPackage: "",
      packageInstallDate: "",
      packageWarrantyExpiration: "",
      packageFirmwareVersion: "",
    })
    setActiveTab("basic")
  }

  const handleSensorToggle = (sensor: string) => {
    setSensors((prev) => ({
      ...prev,
      [sensor]: !prev[sensor as keyof typeof prev],
    }))
  }

  const handleSensorSerialChange = (sensor: string, value: string) => {
    setSensors((prev) => ({
      ...prev,
      [sensor]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>Enter the details for the new ground service equipment.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentType">Equipment Type *</Label>
                <Select value={equipmentType} onValueChange={setEquipmentType} required>
                  <SelectTrigger id="equipmentType">
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes
                      .filter((type) => type.value !== "all")
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. TLD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. TPX-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. SN12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2022" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter equipment description"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Map Placeholder</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={location.lat}
                    onChange={(e) => setLocation({ ...location, lat: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={location.lng}
                    onChange={(e) => setLocation({ ...location, lng: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
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

              {selectedType?.isPowered && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fuelLevel">Fuel Level</Label>
                    <Select value={fuelLevel} onValueChange={setFuelLevel}>
                      <SelectTrigger id="fuelLevel">
                        <SelectValue placeholder="Select fuel level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100%">100%</SelectItem>
                        <SelectItem value="75%">75%</SelectItem>
                        <SelectItem value="50%">50%</SelectItem>
                        <SelectItem value="25%">25%</SelectItem>
                        <SelectItem value="10%">10% (Low)</SelectItem>
                        <SelectItem value="0%">0% (Empty)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batteryLevel">Battery Level</Label>
                    <Select value={batteryLevel} onValueChange={setBatteryLevel}>
                      <SelectTrigger id="batteryLevel">
                        <SelectValue placeholder="Select battery level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100%">100%</SelectItem>
                        <SelectItem value="75%">75%</SelectItem>
                        <SelectItem value="50%">50%</SelectItem>
                        <SelectItem value="25%">25%</SelectItem>
                        <SelectItem value="10%">10% (Low)</SelectItem>
                        <SelectItem value="0%">0% (Dead)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4 mt-4">
            <div className="space-y-6">
              {/* Sensor Package Information */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-medium">Sensor Package Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sensorPackage">Package Type</Label>
                    <Select
                      value={sensors.sensorPackage}
                      onValueChange={(value) => setSensors({ ...sensors, sensorPackage: value })}
                    >
                      <SelectTrigger id="sensorPackage">
                        <SelectValue placeholder="Select package type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Package</SelectItem>
                        <SelectItem value="standard">Standard Package</SelectItem>
                        <SelectItem value="premium">Premium Package</SelectItem>
                        <SelectItem value="custom">Custom Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageInstallDate">Installation Date</Label>
                    <Input
                      id="packageInstallDate"
                      type="date"
                      value={sensors.packageInstallDate}
                      onChange={(e) => setSensors({ ...sensors, packageInstallDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageWarrantyExpiration">Warranty Expiration</Label>
                    <Input
                      id="packageWarrantyExpiration"
                      type="date"
                      value={sensors.packageWarrantyExpiration}
                      onChange={(e) => setSensors({ ...sensors, packageWarrantyExpiration: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageFirmwareVersion">Firmware Version</Label>
                    <Input
                      id="packageFirmwareVersion"
                      value={sensors.packageFirmwareVersion}
                      onChange={(e) => setSensors({ ...sensors, packageFirmwareVersion: e.target.value })}
                      placeholder="e.g. v2.1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Individual Sensors */}
              <h3 className="text-lg font-medium">Individual Sensors</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium" htmlFor="telematicsDevice">
                    Telematics Device
                  </Label>
                  <p className="text-sm text-muted-foreground">GPS and engine monitoring</p>
                </div>
                <Switch
                  id="telematicsDevice"
                  checked={sensors.telematicsDevice}
                  onCheckedChange={() => handleSensorToggle("telematicsDevice")}
                />
              </div>
              {sensors.telematicsDevice && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="telematicsSerial">Serial Number</Label>
                  <Input
                    id="telematicsSerial"
                    value={sensors.telematicsSerial}
                    onChange={(e) => handleSensorSerialChange("telematicsSerial", e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium" htmlFor="bleBeacon">
                    BLE Beacon
                  </Label>
                  <p className="text-sm text-muted-foreground">Bluetooth Low Energy tracking</p>
                </div>
                <Switch
                  id="bleBeacon"
                  checked={sensors.bleBeacon}
                  onCheckedChange={() => handleSensorToggle("bleBeacon")}
                />
              </div>
              {sensors.bleBeacon && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="bleSerial">Serial Number</Label>
                  <Input
                    id="bleSerial"
                    value={sensors.bleSerial}
                    onChange={(e) => handleSensorSerialChange("bleSerial", e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium" htmlFor="levelSensor">
                    Level Sensor
                  </Label>
                  <p className="text-sm text-muted-foreground">Fuel/fluid level monitoring</p>
                </div>
                <Switch
                  id="levelSensor"
                  checked={sensors.levelSensor}
                  onCheckedChange={() => handleSensorToggle("levelSensor")}
                />
              </div>
              {sensors.levelSensor && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="levelSensorSerial">Serial Number</Label>
                  <Input
                    id="levelSensorSerial"
                    value={sensors.levelSensorSerial}
                    onChange={(e) => handleSensorSerialChange("levelSensorSerial", e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium" htmlFor="aiDashcam">
                    AI Dashcam
                  </Label>
                  <p className="text-sm text-muted-foreground">Driver monitoring and safety</p>
                </div>
                <Switch
                  id="aiDashcam"
                  checked={sensors.aiDashcam}
                  onCheckedChange={() => handleSensorToggle("aiDashcam")}
                />
              </div>
              {sensors.aiDashcam && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="aiDashcamSerial">Serial Number</Label>
                  <Input
                    id="aiDashcamSerial"
                    value={sensors.aiDashcamSerial}
                    onChange={(e) => handleSensorSerialChange("aiDashcamSerial", e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!equipmentType || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Adding..." : "Add Equipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
