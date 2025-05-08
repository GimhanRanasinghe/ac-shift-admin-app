"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Check, Truck, Wifi, Thermometer, Gauge, Camera, Bluetooth, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Equipment, equipmentService } from "@/lib/services/equipment-service"

// Sample equipment types
const equipmentTypes = [
  { value: "baggage-tractor", label: "Baggage Tractor", powered: true },
  { value: "belt-loader", label: "Belt Loader", powered: true },
  { value: "pushback-tractor", label: "Pushback Tractor", powered: true },
  { value: "container-loader", label: "Container Loader", powered: true },
  { value: "ground-power", label: "Ground Power Unit", powered: true },
  { value: "lavatory-truck", label: "Lavatory Truck", powered: true },
  { value: "water-truck", label: "Water Truck", powered: true },
  { value: "airstart-unit", label: "Airstart Unit", powered: true },
  { value: "de-icing-truck", label: "De-icing Truck", powered: true },
  { value: "catering-truck", label: "Catering Truck", powered: true },
  { value: "passenger-stairs", label: "Passenger Stairs", powered: false },
  { value: "towbar", label: "Aircraft Towbar", powered: false },
  { value: "lavatory-cart", label: "Lavatory Cart", powered: false },
  { value: "wheelchair-lift", label: "Wheelchair Lift", powered: false },
]

// Sample manufacturers with their models
const manufacturersWithModels = {
  tld: {
    label: "TLD",
    models: [
      { value: "jst-25", label: "JST-25 Baggage Tractor" },
      { value: "jst-30", label: "JST-30 Baggage Tractor" },
      { value: "tpx-100-e", label: "TPX-100-E Electric Pushback" },
      { value: "tpx-200", label: "TPX-200 Conventional Pushback" },
      { value: "rbw-32", label: "RBW-32 Belt Loader" },
    ],
  },
  tug: {
    label: "TUG Technologies",
    models: [
      { value: "ma-50", label: "MA-50 Baggage Tractor" },
      { value: "mt-6", label: "MT-6 Conventional Tractor" },
      { value: "gt-110", label: "GT-110 Pushback Tractor" },
      { value: "660-belt-loader", label: "660 Belt Loader" },
    ],
  },
  charlatte: {
    label: "Charlatte",
    models: [
      { value: "t-135", label: "T-135 Baggage Tractor" },
      { value: "cbt-35", label: "CBT-35 Baggage Tractor" },
      { value: "cl-110", label: "CL-110 Belt Loader" },
    ],
  },
  jbt: {
    label: "JBT AeroTech",
    models: [
      { value: "b1200", label: "B1200 Commander Loader" },
      { value: "aerotech-loader", label: "AeroTech Loader" },
      { value: "jbt-30", label: "JBT-30 Pushback Tractor" },
    ],
  },
  trepel: {
    label: "TREPEL",
    models: [
      { value: "champ-350", label: "CHAMP 350 Cargo Loader" },
      { value: "challenger-160", label: "CHALLENGER 160 Pushback" },
      { value: "charger-380", label: "CHARGER 380 Cargo Loader" },
    ],
  },
  mallaghan: {
    label: "Mallaghan",
    models: [
      { value: "tsc-50000", label: "TSC 50000 Catering Truck" },
      { value: "ml-6100", label: "ML 6100 Passenger Stairs" },
      { value: "ml-4000", label: "ML 4000 Belt Loader" },
    ],
  },
  mulag: {
    label: "MULAG",
    models: [
      { value: "comet-3", label: "Comet 3 Baggage Tractor" },
      { value: "comet-6", label: "Comet 6 Baggage Tractor" },
      { value: "pulsar-7", label: "Pulsar 7 Container Transporter" },
    ],
  },
  textron: {
    label: "Textron GSE",
    models: [
      { value: "beagle", label: "Beagle Baggage Tractor" },
      { value: "sabre-belt-loader", label: "Sabre Belt Loader" },
      { value: "tug-660", label: "TUG 660 Belt Loader" },
    ],
  },
}

// Sample power types
const powerTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "gasoline", label: "Gasoline" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "cng", label: "Compressed Natural Gas" },
]

export default function EquipmentOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [equipmentData, setEquipmentData] = useState({
    // Basic info
    equipmentType: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    yearOfManufacture: new Date().getFullYear().toString(),
    powerType: "",
    description: "",

    // Sensor package
    hasTelematicsDevice: false,
    telematicsSerialNumber: "",
    hasBleBeacon: false,
    bleBeaconSerialNumber: "",

    // Additional sensors
    hasLevelSensor: false,
    levelSensorSerialNumber: "",
    hasTemperatureSensor: false,
    temperatureSensorSerialNumber: "",
    hasAiDashcam: false,
    aiDashcamSerialNumber: "",
    hasInternalCamera: false,
    internalCameraSerialNumber: "",
    hasExternalCamera: false,
    externalCameraSerialNumber: "",

    // Maintenance info
    maintenanceInterval: "90",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  })

  const [availableModels, setAvailableModels] = useState<{ value: string; label: string }[]>([])
  const [availableYears, setAvailableYears] = useState<{ value: string; label: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdEquipmentId, setCreatedEquipmentId] = useState<number | null>(null)

  // Generate years for dropdown (current year down to 1980)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1980; year--) {
      years.push({ value: year.toString(), label: year.toString() })
    }
    setAvailableYears(years)
  }, [])

  // Update available models when manufacturer changes
  useEffect(() => {
    if (equipmentData.manufacturer) {
      const selectedManufacturer =
        manufacturersWithModels[equipmentData.manufacturer as keyof typeof manufacturersWithModels]
      if (selectedManufacturer) {
        setAvailableModels(selectedManufacturer.models)
        // Reset model when manufacturer changes
        setEquipmentData((prev) => ({ ...prev, model: "" }))
      }
    } else {
      setAvailableModels([])
    }
  }, [equipmentData.manufacturer])

  // Reset relevant fields when equipment type changes
  useEffect(() => {
    if (equipmentData.equipmentType) {
      const selectedType = equipmentTypes.find((type) => type.value === equipmentData.equipmentType)

      // If changing from powered to non-powered or vice versa, reset sensor-related fields
      setEquipmentData((prev) => ({
        ...prev,
        // Reset power type if not powered
        powerType: selectedType?.powered ? prev.powerType : "",

        // Reset telematics if switching to non-powered
        hasTelematicsDevice: selectedType?.powered ? prev.hasTelematicsDevice : false,
        telematicsSerialNumber: selectedType?.powered ? prev.telematicsSerialNumber : "",

        // Reset BLE beacon if switching to powered
        hasBleBeacon: !selectedType?.powered ? prev.hasBleBeacon : false,
        bleBeaconSerialNumber: !selectedType?.powered ? prev.bleBeaconSerialNumber : "",

        // Reset additional sensors if switching to non-powered
        hasLevelSensor: selectedType?.powered ? prev.hasLevelSensor : false,
        levelSensorSerialNumber: selectedType?.powered ? prev.levelSensorSerialNumber : "",
        hasTemperatureSensor: selectedType?.powered ? prev.hasTemperatureSensor : false,
        temperatureSensorSerialNumber: selectedType?.powered ? prev.temperatureSensorSerialNumber : "",
        hasAiDashcam: selectedType?.powered ? prev.hasAiDashcam : false,
        aiDashcamSerialNumber: selectedType?.powered ? prev.aiDashcamSerialNumber : "",
        hasInternalCamera: selectedType?.powered ? prev.hasInternalCamera : false,
        internalCameraSerialNumber: selectedType?.powered ? prev.internalCameraSerialNumber : "",
        hasExternalCamera: selectedType?.powered ? prev.hasExternalCamera : false,
        externalCameraSerialNumber: selectedType?.powered ? prev.externalCameraSerialNumber : "",
      }))
    }
  }, [equipmentData.equipmentType])

  const isPowered = () => {
    const selectedType = equipmentTypes.find((type) => type.value === equipmentData.equipmentType)
    return selectedType?.powered || false
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setEquipmentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep === 2 && isPowered() && !equipmentData.hasTelematicsDevice) {
      // Skip step 3 (Additional Sensors) if Telematics Device is not selected
      setCurrentStep(4)
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    if (currentStep === 4 && isPowered() && !equipmentData.hasTelematicsDevice) {
      // Skip step 3 (Additional Sensors) when going back if Telematics Device is not selected
      setCurrentStep(2)
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }
  }

  // Map form data to API equipment model
  const mapFormDataToApiModel = (): Omit<Equipment, 'id'> => {
    // Get equipment type ID from the selected equipment type
    const equipmentTypeId = equipmentTypes.findIndex(type => type.value === equipmentData.equipmentType) + 1;

    // Format dates
    const today = new Date().toISOString().split('T')[0];
    const lastMaintenanceDate = equipmentData.lastMaintenanceDate || today;

    // Calculate next maintenance date based on interval
    const nextMaintenanceDate = new Date(lastMaintenanceDate);
    nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + parseInt(equipmentData.maintenanceInterval));

    // Current timestamp for created_at and updated_at
    const timestamp = new Date().toISOString();

    return {
      equipment_type_id: equipmentTypeId,
      serial_number: equipmentData.serialNumber,
      manufacturer: equipmentData.manufacturer,
      model: equipmentData.model,
      year_manufactured: parseInt(equipmentData.yearOfManufacture),
      purchase_date: today, // Default to today if not provided
      last_maintenance_date: lastMaintenanceDate,
      next_maintenance_date: nextMaintenanceDate.toISOString().split('T')[0],
      created_at: timestamp,
      updated_at: timestamp
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Map form data to API model
      const apiEquipment = mapFormDataToApiModel();

      // Call the API to create the equipment
      const response = await equipmentService.create(apiEquipment);

      // Store the created equipment ID
      setCreatedEquipmentId(response.id);

      // Set complete state
      setIsComplete(true);
    } catch (err) {
      console.error('Error creating equipment:', err);
      setError('Failed to create equipment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateEquipmentId = () => {
    if (!equipmentData.equipmentType) return "---"

    const typePrefix = equipmentData.equipmentType.substring(0, 3).toUpperCase()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${typePrefix}-${randomNum}`
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Equipment Onboarding</h1>
          <Button variant="outline" onClick={() => router.push("/fleet")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fleet Management
          </Button>
        </div>

        {!isComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Add New Equipment</CardTitle>
              <CardDescription>Register new ground service equipment and associate sensor packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex flex-col items-center ${
                        step < currentStep
                          ? "text-blue-600"
                          : step === currentStep
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step < currentStep
                            ? "bg-blue-100 text-blue-600"
                            : step === currentStep
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < currentStep ? <Check className="h-5 w-5" /> : step}
                      </div>
                      <span className="text-sm">
                        {step === 1
                          ? "Basic Info"
                          : step === 2
                            ? "Sensor Package"
                            : step === 3
                              ? "Additional Sensors"
                              : "Maintenance"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-full">
                    <div
                      className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="equipmentType">Equipment Type *</Label>
                      <Select
                        value={equipmentData.equipmentType}
                        onValueChange={(value) => handleInputChange("equipmentType", value)}
                        required
                      >
                        <SelectTrigger id="equipmentType">
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Manufacturer *</Label>
                      <Select
                        value={equipmentData.manufacturer}
                        onValueChange={(value) => handleInputChange("manufacturer", value)}
                        required
                      >
                        <SelectTrigger id="manufacturer">
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(manufacturersWithModels).map(([key, manufacturer]) => (
                            <SelectItem key={key} value={key}>
                              {manufacturer.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Select
                        value={equipmentData.model}
                        onValueChange={(value) => handleInputChange("model", value)}
                        disabled={!equipmentData.manufacturer}
                        required
                      >
                        <SelectTrigger id="model">
                          <SelectValue
                            placeholder={equipmentData.manufacturer ? "Select model" : "Select manufacturer first"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Serial Number *</Label>
                      <Input
                        id="serialNumber"
                        value={equipmentData.serialNumber}
                        onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                        placeholder="Enter serial number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearOfManufacture">Year of Manufacture *</Label>
                      <Select
                        value={equipmentData.yearOfManufacture}
                        onValueChange={(value) => handleInputChange("yearOfManufacture", value)}
                        required
                      >
                        <SelectTrigger id="yearOfManufacture">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableYears.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {equipmentData.equipmentType && isPowered() && (
                      <div className="space-y-2">
                        <Label htmlFor="powerType">Power Type *</Label>
                        <Select
                          value={equipmentData.powerType}
                          onValueChange={(value) => handleInputChange("powerType", value)}
                          required
                        >
                          <SelectTrigger id="powerType">
                            <SelectValue placeholder="Select power type" />
                          </SelectTrigger>
                          <SelectContent>
                            {powerTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={equipmentData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter additional details about the equipment"
                      rows={3}
                    />
                  </div>

                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-5 w-5 text-blue-400" />
                      <h3 className="font-medium text-gray-100">Equipment ID Preview</h3>
                    </div>
                    <p className="text-gray-300">
                      This equipment will be assigned ID:{" "}
                      <strong className="text-gray-100">{generateEquipmentId()}</strong>
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 mb-6">
                    <h3 className="font-medium text-gray-100 mb-2">Sensor Package Information</h3>
                    <p className="text-gray-300 text-sm">
                      {isPowered()
                        ? "This is powered equipment. You can associate a telematics device and other sensors."
                        : "This is non-powered equipment. You can associate a BLE beacon for location tracking."}
                    </p>
                  </div>

                  {isPowered() ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Wifi className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="space-y-0.5">
                            <Label htmlFor="hasTelematicsDevice">Telematics Device</Label>
                            <p className="text-sm text-muted-foreground">GPS and engine monitoring</p>
                          </div>
                        </div>
                        <Switch
                          id="hasTelematicsDevice"
                          checked={equipmentData.hasTelematicsDevice}
                          onCheckedChange={(checked) => handleInputChange("hasTelematicsDevice", checked)}
                        />
                      </div>

                      {equipmentData.hasTelematicsDevice && (
                        <div className="ml-12 p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="telematicsSerialNumber">Device Serial Number *</Label>
                            <Input
                              id="telematicsSerialNumber"
                              value={equipmentData.telematicsSerialNumber}
                              onChange={(e) => handleInputChange("telematicsSerialNumber", e.target.value)}
                              placeholder="Enter telematics device serial number"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-full">
                            <Bluetooth className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="space-y-0.5">
                            <Label htmlFor="hasBleBeacon">BLE Beacon</Label>
                            <p className="text-sm text-muted-foreground">Bluetooth Low Energy tracking</p>
                          </div>
                        </div>
                        <Switch
                          id="hasBleBeacon"
                          checked={equipmentData.hasBleBeacon}
                          onCheckedChange={(checked) => handleInputChange("hasBleBeacon", checked)}
                        />
                      </div>

                      {equipmentData.hasBleBeacon && (
                        <div className="ml-12 p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bleBeaconSerialNumber">Beacon Serial Number *</Label>
                            <Input
                              id="bleBeaconSerialNumber"
                              value={equipmentData.bleBeaconSerialNumber}
                              onChange={(e) => handleInputChange("bleBeaconSerialNumber", e.target.value)}
                              placeholder="Enter BLE beacon serial number"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Camera className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="space-y-0.5">
                            <Label htmlFor="hasAiDashcam">AI Dashcam</Label>
                            <p className="text-sm text-muted-foreground">Driver monitoring and safety</p>
                          </div>
                        </div>
                        <Switch
                          id="hasAiDashcam"
                          checked={equipmentData.hasAiDashcam}
                          onCheckedChange={(checked) => handleInputChange("hasAiDashcam", checked)}
                        />
                      </div>

                      {equipmentData.hasAiDashcam && (
                        <div className="ml-12 p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="aiDashcamSerialNumber">AI Dashcam Serial Number *</Label>
                            <Input
                              id="aiDashcamSerialNumber"
                              value={equipmentData.aiDashcamSerialNumber}
                              onChange={(e) => handleInputChange("aiDashcamSerialNumber", e.target.value)}
                              placeholder="Enter AI dashcam serial number"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-full">
                            <Bluetooth className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="space-y-0.5">
                            <Label htmlFor="hasBleBeacon">BLE Beacon</Label>
                            <p className="text-sm text-muted-foreground">
                              Bluetooth Low Energy tracking for non-powered equipment
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="hasBleBeacon"
                          checked={equipmentData.hasBleBeacon}
                          onCheckedChange={(checked) => handleInputChange("hasBleBeacon", checked)}
                        />
                      </div>

                      {equipmentData.hasBleBeacon && (
                        <div className="ml-12 p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bleBeaconSerialNumber">Beacon Serial Number *</Label>
                            <Input
                              id="bleBeaconSerialNumber"
                              value={equipmentData.bleBeaconSerialNumber}
                              onChange={(e) => handleInputChange("bleBeaconSerialNumber", e.target.value)}
                              placeholder="Enter BLE beacon serial number"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && isPowered() && equipmentData.hasTelematicsDevice && (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 mb-6">
                    <h3 className="font-medium text-gray-100 mb-2">Additional Sensors</h3>
                    <p className="text-gray-300 text-sm">
                      Add specialized sensors to collect more detailed telemetry data from this equipment.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <Gauge className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="space-y-0.5">
                          <Label htmlFor="hasLevelSensor">Level Sensor</Label>
                          <p className="text-sm text-muted-foreground">
                            Monitor fluid levels (fuel, hydraulic fluid, etc.)
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="hasLevelSensor"
                        checked={equipmentData.hasLevelSensor}
                        onCheckedChange={(checked) => handleInputChange("hasLevelSensor", checked)}
                      />
                    </div>

                    {equipmentData.hasLevelSensor && (
                      <div className="ml-12 p-4 border rounded-lg space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="levelSensorSerialNumber">Level Sensor Serial Number *</Label>
                          <Input
                            id="levelSensorSerialNumber"
                            value={equipmentData.levelSensorSerialNumber}
                            onChange={(e) => handleInputChange("levelSensorSerialNumber", e.target.value)}
                            placeholder="Enter level sensor serial number"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Thermometer className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="space-y-0.5">
                          <Label htmlFor="hasTemperatureSensor">Temperature Sensor</Label>
                          <p className="text-sm text-muted-foreground">Monitor engine and component temperatures</p>
                        </div>
                      </div>
                      <Switch
                        id="hasTemperatureSensor"
                        checked={equipmentData.hasTemperatureSensor}
                        onCheckedChange={(checked) => handleInputChange("hasTemperatureSensor", checked)}
                      />
                    </div>

                    {equipmentData.hasTemperatureSensor && (
                      <div className="ml-12 p-4 border rounded-lg space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="temperatureSensorSerialNumber">Temperature Sensor Serial Number *</Label>
                          <Input
                            id="temperatureSensorSerialNumber"
                            value={equipmentData.temperatureSensorSerialNumber}
                            onChange={(e) => handleInputChange("temperatureSensorSerialNumber", e.target.value)}
                            placeholder="Enter temperature sensor serial number"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Camera className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="space-y-0.5">
                          <Label htmlFor="hasAiDashcam">AI Dashcam</Label>
                          <p className="text-sm text-muted-foreground">
                            Advanced camera system with AI-powered safety features
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="hasAiDashcam"
                        checked={equipmentData.hasAiDashcam}
                        onCheckedChange={(checked) => handleInputChange("hasAiDashcam", checked)}
                      />
                    </div> */}

                    {equipmentData.hasAiDashcam && (
                      <div className="ml-12 space-y-4">
                        <div className="p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="aiDashcamSerialNumber">AI Dashcam Serial Number *</Label>
                            <Input
                              id="aiDashcamSerialNumber"
                              value={equipmentData.aiDashcamSerialNumber}
                              onChange={(e) => handleInputChange("aiDashcamSerialNumber", e.target.value)}
                              placeholder="Enter AI dashcam serial number"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="hasInternalCamera">Internal Camera</Label>
                            <p className="text-sm text-muted-foreground">Monitor operator behavior</p>
                          </div>
                          <Switch
                            id="hasInternalCamera"
                            checked={equipmentData.hasInternalCamera}
                            onCheckedChange={(checked) => handleInputChange("hasInternalCamera", checked)}
                          />
                        </div>

                        {equipmentData.hasInternalCamera && (
                          <div className="ml-6 p-4 border rounded-lg space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="internalCameraSerialNumber">Internal Camera Serial Number *</Label>
                              <Input
                                id="internalCameraSerialNumber"
                                value={equipmentData.internalCameraSerialNumber}
                                onChange={(e) => handleInputChange("internalCameraSerialNumber", e.target.value)}
                                placeholder="Enter internal camera serial number"
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="hasExternalCamera">External Camera</Label>
                            <p className="text-sm text-muted-foreground">Monitor surroundings</p>
                          </div>
                          <Switch
                            id="hasExternalCamera"
                            checked={equipmentData.hasExternalCamera}
                            onCheckedChange={(checked) => handleInputChange("hasExternalCamera", checked)}
                          />
                        </div>

                        {equipmentData.hasExternalCamera && (
                          <div className="ml-6 p-4 border rounded-lg space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="externalCameraSerialNumber">External Camera Serial Number *</Label>
                              <Input
                                id="externalCameraSerialNumber"
                                value={equipmentData.externalCameraSerialNumber}
                                onChange={(e) => handleInputChange("externalCameraSerialNumber", e.target.value)}
                                placeholder="Enter external camera serial number"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div className="space-y-2">
                      <Label htmlFor="maintenanceInterval">Maintenance Interval (Days) *</Label>
                      <Input
                        id="maintenanceInterval"
                        type="number"
                        min="1"
                        max="365"
                        value={equipmentData.maintenanceInterval}
                        onChange={(e) => handleInputChange("maintenanceInterval", e.target.value)}
                        placeholder="Enter maintenance interval in days"
                        required
                      />
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
                      <Input
                        id="lastMaintenanceDate"
                        type="date"
                        value={equipmentData.lastMaintenanceDate}
                        onChange={(e) => handleInputChange("lastMaintenanceDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 text-gray-100">
                    <h3 className="font-medium text-gray-100 mb-2">Equipment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Equipment ID:</span>
                        <span className="text-sm font-medium text-gray-100">{generateEquipmentId()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Type:</span>
                        <span className="text-sm font-medium text-gray-100">
                          {equipmentTypes.find((t) => t.value === equipmentData.equipmentType)?.label || "---"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Manufacturer:</span>
                        <span className="text-sm font-medium text-gray-100">
                          {equipmentData.manufacturer
                            ? manufacturersWithModels[
                                equipmentData.manufacturer as keyof typeof manufacturersWithModels
                              ]?.label || "---"
                            : "---"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Model:</span>
                        <span className="text-sm font-medium text-gray-100">
                          {availableModels.find((m) => m.value === equipmentData.model)?.label || "---"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Serial Number:</span>
                        <span className="text-sm font-medium text-gray-100">{equipmentData.serialNumber || "---"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Year:</span>
                        <span className="text-sm font-medium text-gray-100">
                          {equipmentData.yearOfManufacture || "---"}
                        </span>
                      </div>
                      {isPowered() && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Power Type:</span>
                          <span className="text-sm font-medium text-gray-100">
                            {powerTypes.find((p) => p.value === equipmentData.powerType)?.label || "---"}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4 bg-gray-700" />

                    <h4 className="font-medium text-gray-100 mb-2">Sensor Package</h4>
                    <div className="space-y-2">
                      {isPowered() ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={equipmentData.hasTelematicsDevice ? "default" : "outline"}
                              className={
                                equipmentData.hasTelematicsDevice ? "bg-blue-600" : "border-gray-600 text-gray-400"
                              }
                            >
                              Telematics Device
                            </Badge>
                            {equipmentData.hasTelematicsDevice && (
                              <span className="text-xs text-gray-400">
                                SN: {equipmentData.telematicsSerialNumber || "---"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={equipmentData.hasLevelSensor ? "default" : "outline"}
                              className={equipmentData.hasLevelSensor ? "bg-blue-600" : "border-gray-600 text-gray-400"}
                            >
                              Level Sensor
                            </Badge>
                            {equipmentData.hasLevelSensor && (
                              <span className="text-xs text-gray-400">
                                SN: {equipmentData.levelSensorSerialNumber || "---"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={equipmentData.hasTemperatureSensor ? "default" : "outline"}
                              className={
                                equipmentData.hasTemperatureSensor ? "bg-blue-600" : "border-gray-600 text-gray-400"
                              }
                            >
                              Temperature Sensor
                            </Badge>
                            {equipmentData.hasTemperatureSensor && (
                              <span className="text-xs text-gray-400">
                                SN: {equipmentData.temperatureSensorSerialNumber || "---"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant={equipmentData.hasAiDashcam ? "default" : "outline"}
                              className={equipmentData.hasAiDashcam ? "bg-blue-600" : "border-gray-600 text-gray-400"}
                            >
                              AI Dashcam
                            </Badge>
                            {equipmentData.hasAiDashcam && (
                              <span className="text-xs text-gray-400">
                                SN: {equipmentData.aiDashcamSerialNumber || "---"}
                              </span>
                            )}
                          </div>
                          {equipmentData.hasAiDashcam && (
                            <>
                              <div className="flex flex-wrap gap-2 ml-4">
                                <Badge
                                  variant={equipmentData.hasInternalCamera ? "default" : "outline"}
                                  className={
                                    equipmentData.hasInternalCamera ? "bg-blue-600" : "border-gray-600 text-gray-400"
                                  }
                                >
                                  Internal Camera
                                </Badge>
                                {equipmentData.hasInternalCamera && (
                                  <span className="text-xs text-gray-400">
                                    SN: {equipmentData.internalCameraSerialNumber || "---"}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 ml-4">
                                <Badge
                                  variant={equipmentData.hasExternalCamera ? "default" : "outline"}
                                  className={
                                    equipmentData.hasExternalCamera ? "bg-blue-600" : "border-gray-600 text-gray-400"
                                  }
                                >
                                  External Camera
                                </Badge>
                                {equipmentData.hasExternalCamera && (
                                  <span className="text-xs text-gray-400">
                                    SN: {equipmentData.externalCameraSerialNumber || "---"}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={equipmentData.hasBleBeacon ? "default" : "outline"}
                            className={equipmentData.hasBleBeacon ? "bg-blue-600" : "border-gray-600 text-gray-400"}
                          >
                            BLE Beacon
                          </Badge>
                          {equipmentData.hasBleBeacon && (
                            <span className="text-xs text-gray-400">
                              SN: {equipmentData.bleBeaconSerialNumber || "---"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {error && (
                <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Complete Onboarding"}
                    {isSubmitting ? (
                      <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center pb-2">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle>Equipment Onboarded Successfully</CardTitle>
              <CardDescription>
                The equipment has been registered and sensor package associations have been created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 mb-6 text-gray-100">
                <h3 className="font-medium text-gray-100 mb-4 text-center">Equipment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Equipment ID:</span>
                    <span className="font-medium text-gray-100">{createdEquipmentId || generateEquipmentId()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="font-medium text-gray-100">
                      {equipmentTypes.find((t) => t.value === equipmentData.equipmentType)?.label || "---"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Manufacturer:</span>
                    <span className="font-medium text-gray-100">
                      {equipmentData.manufacturer
                        ? manufacturersWithModels[equipmentData.manufacturer as keyof typeof manufacturersWithModels]
                            ?.label || "---"
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="font-medium text-gray-100">
                      {availableModels.find((m) => m.value === equipmentData.model)?.label || "---"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Serial Number:</span>
                    <span className="font-medium text-gray-100">{equipmentData.serialNumber || "---"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span className="font-medium text-gray-100">{equipmentData.yearOfManufacture || "---"}</span>
                  </div>
                </div>

                <Separator className="my-4 bg-gray-700" />

                <h4 className="font-medium text-gray-100 mb-4 text-center">Sensor Package</h4>
                <div className="space-y-4">
                  {isPowered() ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Telematics Device:</span>
                        <div className="flex items-center gap-2">
                          {equipmentData.hasTelematicsDevice ? (
                            <>
                              <Badge className="bg-blue-600">Connected</Badge>
                              <span className="text-sm">SN: {equipmentData.telematicsSerialNumber || "---"}</span>
                            </>
                          ) : (
                            <Badge variant="outline">Not Connected</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Level Sensor:</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={equipmentData.hasLevelSensor ? "default" : "outline"}
                            className={equipmentData.hasLevelSensor ? "bg-blue-600" : ""}
                          >
                            {equipmentData.hasLevelSensor ? "Installed" : "Not Installed"}
                          </Badge>
                          {equipmentData.hasLevelSensor && (
                            <span className="text-sm">SN: {equipmentData.levelSensorSerialNumber || "---"}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Temperature Sensor:</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={equipmentData.hasTemperatureSensor ? "default" : "outline"}
                            className={equipmentData.hasTemperatureSensor ? "bg-blue-600" : ""}
                          >
                            {equipmentData.hasTemperatureSensor ? "Installed" : "Not Installed"}
                          </Badge>
                          {equipmentData.hasTemperatureSensor && (
                            <span className="text-sm">SN: {equipmentData.temperatureSensorSerialNumber || "---"}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">AI Dashcam:</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={equipmentData.hasAiDashcam ? "default" : "outline"}
                            className={equipmentData.hasAiDashcam ? "bg-blue-600" : ""}
                          >
                            {equipmentData.hasAiDashcam ? "Installed" : "Not Installed"}
                          </Badge>
                          {equipmentData.hasAiDashcam && (
                            <span className="text-sm">SN: {equipmentData.aiDashcamSerialNumber || "---"}</span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">BLE Beacon:</span>
                      <div className="flex items-center gap-2">
                        {equipmentData.hasBleBeacon ? (
                          <>
                            <Badge className="bg-blue-600">Connected</Badge>
                            <span className="text-sm">SN: {equipmentData.bleBeaconSerialNumber || "---"}</span>
                          </>
                        ) : (
                          <Badge variant="outline">Not Connected</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-5 w-5 text-blue-400" />
                    <h3 className="font-medium text-gray-100">Telemetry Data Collection</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    This equipment is now configured to transmit telemetry data to the GSE management platform. Data
                    collection will begin automatically when the equipment is next used.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/fleet/inventory")}>
                View Equipment Inventory
              </Button>
              <Button
                onClick={() => {
                  setIsComplete(false)
                  setCurrentStep(1)
                  setEquipmentData({
                    equipmentType: "",
                    manufacturer: "",
                    model: "",
                    serialNumber: "",
                    yearOfManufacture: new Date().getFullYear().toString(),
                    powerType: "",
                    description: "",
                    hasTelematicsDevice: false,
                    telematicsSerialNumber: "",
                    hasBleBeacon: false,
                    bleBeaconSerialNumber: "",
                    hasLevelSensor: false,
                    levelSensorSerialNumber: "",
                    hasTemperatureSensor: false,
                    temperatureSensorSerialNumber: "",
                    hasAiDashcam: false,
                    aiDashcamSerialNumber: "",
                    hasInternalCamera: false,
                    internalCameraSerialNumber: "",
                    hasExternalCamera: false,
                    externalCameraSerialNumber: "",
                    maintenanceInterval: "90",
                    lastMaintenanceDate: "",
                    nextMaintenanceDate: "",
                  })
                }}
              >
                Onboard Another Equipment
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DesktopLayout>
  )
}
