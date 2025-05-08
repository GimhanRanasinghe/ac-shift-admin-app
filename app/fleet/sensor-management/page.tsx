"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter, Wifi, Bluetooth, Thermometer, Gauge, Camera } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Sample equipment data with sensor information
const equipmentData = [
  {
    id: "BTG-1045",
    type: "Baggage Tractor",
    manufacturer: "TLD",
    model: "JET-16",
    powered: true,
    sensors: {
      telematics: {
        installed: true,
        provider: "Geotab",
        serialNumber: "GT-78945612",
        lastTransmission: "2024-05-10T08:45:00",
        status: "active",
      },
      levelSensor: {
        installed: true,
        lastCalibration: "2024-03-15",
      },
      temperatureSensor: {
        installed: false,
      },
      aiDashcam: {
        installed: true,
        internalCamera: true,
        externalCamera: true,
      },
    },
  },
  {
    id: "BLW-0872",
    type: "Belt Loader",
    manufacturer: "JBT AeroTech",
    model: "B-Loader 7000",
    powered: true,
    sensors: {
      telematics: {
        installed: true,
        provider: "Samsara",
        serialNumber: "SM-45678901",
        lastTransmission: "2024-05-10T09:30:00",
        status: "active",
      },
      levelSensor: {
        installed: true,
        lastCalibration: "2024-02-20",
      },
      temperatureSensor: {
        installed: true,
        lastCalibration: "2024-02-20",
      },
      aiDashcam: {
        installed: false,
      },
    },
  },
  {
    id: "ATF-0023",
    type: "Pushback Tractor",
    manufacturer: "TLD",
    model: "TPX-200",
    powered: true,
    sensors: {
      telematics: {
        installed: true,
        provider: "Verizon Connect",
        serialNumber: "VC-12345678",
        lastTransmission: "2024-05-09T16:15:00",
        status: "inactive",
      },
      levelSensor: {
        installed: false,
      },
      temperatureSensor: {
        installed: true,
        lastCalibration: "2024-01-10",
      },
      aiDashcam: {
        installed: true,
        internalCamera: true,
        externalCamera: false,
      },
    },
  },
  {
    id: "PS-0001",
    type: "Passenger Stairs",
    manufacturer: "Mallaghan",
    model: "PS6000",
    powered: false,
    sensors: {
      bleBeacon: {
        installed: true,
        provider: "Kontakt.io",
        serialNumber: "KT-87654321",
        lastTransmission: "2024-05-10T07:20:00",
        status: "active",
      },
    },
  },
  {
    id: "ABM-0004",
    type: "A319/320/321 Towbar",
    manufacturer: "TREPEL",
    model: "TB-A320",
    powered: false,
    sensors: {
      bleBeacon: {
        installed: false,
      },
    },
  },
]

export default function SensorManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sensorFilter, setSensorFilter] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter equipment based on search and filters
  const filteredEquipment = equipmentData.filter((equipment) => {
    const matchesSearch =
      searchQuery === "" ||
      equipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" ||
      (typeFilter === "powered" && equipment.powered) ||
      (typeFilter === "non-powered" && !equipment.powered)

    const matchesSensor = sensorFilter === "all" ||
      (sensorFilter === "telematics" && equipment.powered && equipment.sensors.telematics?.installed) ||
      (sensorFilter === "ble" && !equipment.powered && equipment.sensors.bleBeacon?.installed) ||
      (sensorFilter === "level" && equipment.powered && equipment.sensors.levelSensor?.installed) ||
      (sensorFilter === "temperature" && equipment.powered && equipment.sensors.temperatureSensor?.installed) ||
      (sensorFilter === "dashcam" && equipment.powered && equipment.sensors.aiDashcam?.installed) ||
      (sensorFilter === "none" && ((equipment.powered && !equipment.sensors.telematics?.installed) ||
                                  (!equipment.powered && !equipment.sensors.bleBeacon?.installed)))

    return matchesSearch && matchesType && matchesSensor
  })

  const handleAddSensor = (equipment: any) => {
    setSelectedEquipment(equipment)
    setIsDialogOpen(true)
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Sensor Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Equipment Sensor Packages</CardTitle>
            <CardDescription>View and manage sensor associations for all equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search equipment..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Equipment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="powered">Powered</SelectItem>
                        <SelectItem value="non-powered">Non-Powered</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sensorFilter} onValueChange={setSensorFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sensor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sensors</SelectItem>
                        <SelectItem value="telematics">Telematics</SelectItem>
                        <SelectItem value="ble">BLE Beacon</SelectItem>
                        <SelectItem value="level">Level Sensor</SelectItem>
                        <SelectItem value="temperature">Temperature Sensor</SelectItem>
                        <SelectItem value="dashcam">AI Dashcam</SelectItem>
                        <SelectItem value="none">No Sensors</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Primary Sensor</TableHead>
                      <TableHead>Additional Sensors</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Transmission</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-medium">{equipment.id}</TableCell>
                        <TableCell>
                          {equipment.type}
                          <div className="text-xs text-muted-foreground">{equipment.manufacturer} {equipment.model}</div>
                        </TableCell>
                        <TableCell>
                          {equipment.powered ? (
                            <div className="flex items-center gap-2">
                              <Wifi className={`h-4 w-4 ${equipment.sensors.telematics?.installed ? 'text-green-500' : 'text-gray-300'}`} />
                              <span>
                                {equipment.sensors.telematics?.installed
                                  ? `${equipment.sensors.telematics.provider} Telematics`
                                  : "No Telematics"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Bluetooth className={`h-4 w-4 ${equipment.sensors.bleBeacon?.installed ? 'text-blue-500' : 'text-gray-300'}`} />
                              <span>
                                {equipment.sensors.bleBeacon?.installed
                                  ? `${equipment.sensors.bleBeacon.provider} BLE Beacon`
                                  : "No BLE Beacon"}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {equipment.powered && (
                            <div className="flex flex-wrap gap-1">
                              {equipment.sensors.levelSensor?.installed && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  <Gauge className="h-3 w-3 mr-1" />
                                  Level
                                </Badge>
                              )}
                              {equipment.sensors.temperatureSensor?.installed && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  <Thermometer className="h-3 w-3 mr-1" />
                                  Temp
                                </Badge>
                              )}
                              {equipment.sensors.aiDashcam?.installed && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  <Camera className="h-3 w-3 mr-1" />
                                  Dashcam
                                </Badge>
                              )}
                              {!equipment.sensors.levelSensor?.installed &&
                               !equipment.sensors.temperatureSensor?.installed &&
                               !equipment.sensors.aiDashcam?.installed && (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {equipment.powered && equipment.sensors.telematics?.installed ? (
                            <Badge
                              variant="outline"
                              className={equipment.sensors.telematics.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"}
                            >
                              {equipment.sensors.telematics.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          ) : !equipment.powered && equipment.sensors.bleBeacon?.installed ? (
                            <Badge
                              variant="outline"
                              className={equipment.sensors.bleBeacon.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"}
                            >
                              {equipment.sensors.bleBeacon.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Connected</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {equipment.powered && equipment.sensors.telematics?.installed ? (
                            <span className="text-sm">
                              {new Date(equipment.sensors.telematics.lastTransmission).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                          ) : !equipment.powered && equipment.sensors.bleBeacon?.installed ? (
                            <span className="text-sm">
                              {new Date(equipment.sensors.bleBeacon.lastTransmission).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleAddSensor(equipment)}>
                            {equipment.powered ? (
                              equipment.sensors.telematics?.installed ? "Manage Sensors" : "Add Telematics"
                            ) : (
                              equipment.sensors.bleBeacon?.installed ? "Manage Beacon" : "Add Beacon"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEquipment?.powered ? "Manage Sensor Package" : "Manage BLE Beacon"}
            </DialogTitle>
            <DialogDescription>
              {selectedEquipment?.id} - {selectedEquipment?.type}
            </DialogDescription>
          </DialogHeader>

          {selectedEquipment?.powered ? (
            <div className="space-y-4 py-4">
              <div className="space-y-4 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label className="text-base">Telematics Device</Label>
                      <p className="text-sm text-muted-foreground">Real-time location and engine data</p>
                    </div>
                  </div>
                  <Switch checked={selectedEquipment?.sensors.telematics?.installed || false} />
                </div>

                {selectedEquipment?.sensors.telematics?.installed && (
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="telematicsProvider">Provider</Label>
                      <Select defaultValue={selectedEquipment?.sensors.telematics?.provider}>
                        <SelectTrigger id="telematicsProvider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Geotab">Geotab</SelectItem>
                          <SelectItem value="Samsara">Samsara</SelectItem>
                          <SelectItem value="Verizon Connect">Verizon Connect</SelectItem>
                          <SelectItem value="Zonar">Zonar</SelectItem>
                          <SelectItem value="Fleetio">Fleetio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Serial Number</Label>
                      <Input
                        id="serialNumber"
                        defaultValue={selectedEquipment?.sensors.telematics?.serialNumber}
                        placeholder="Enter device serial number"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Additional Sensors</h3>

                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-amber-500" />
                    <div>
                      <Label className="text-base">Level Sensor</Label>
                      <p className="text-sm text-muted-foreground">Monitor fluid levels</p>
                    </div>
                  </div>
                  <Switch checked={selectedEquipment?.sensors.levelSensor?.installed || false} />
                </div>

                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <div>
                      <Label className="text-base">Temperature Sensor</Label>
                      <p className="text-sm text-muted-foreground">Monitor engine temperature</p>
                    </div>
                  </div>
                  <Switch checked={selectedEquipment?.sensors.temperatureSensor?.installed || false} />
                </div>

                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-purple-500" />
                    <div>
                      <Label className="text-base">AI Dashcam</Label>
                      <p className="text-sm text-muted-foreground">Safety monitoring system</p>
                    </div>
                  </div>
                  <Switch checked={selectedEquipment?.sensors.aiDashcam?.installed || false} />
                </div>

                {selectedEquipment?.sensors.aiDashcam?.installed && (
                  <div className="pl-7 space-y-3">
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <Label className="text-sm">Internal Camera</Label>
                      <Switch checked={selectedEquipment?.sensors.aiDashcam?.internalCamera || false} />
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <Label className="text-sm">External Camera</Label>
                      <Switch checked={selectedEquipment?.sensors.aiDashcam?.externalCamera || false} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-4 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label className="text-base">BLE Beacon</Label>
                      <p className="text-sm text-muted-foreground">Location tracking for non-powered equipment</p>
                    </div>
                  </div>
                  <Switch checked={selectedEquipment?.sensors.bleBeacon?.installed || false} />
                </div>

                {selectedEquipment?.sensors.bleBeacon?.installed && (
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="bleProvider">Provider</Label>
                      <Select defaultValue={selectedEquipment?.sensors.bleBeacon?.provider}>
                        <SelectTrigger id="bleProvider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kontakt.io">Kontakt.io</SelectItem>
                          <SelectItem value="Estimote">Estimote</SelectItem>
                          <SelectItem value="Aruba">Aruba</SelectItem>
                          <SelectItem value="RadiusNetworks">RadiusNetworks</SelectItem>
                          <SelectItem value="BluVision">BluVision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bleSerialNumber">Beacon ID</Label>
                      <Input
                        id="bleSerialNumber"
                        defaultValue={selectedEquipment?.sensors.bleBeacon?.serialNumber}
                        placeholder="Enter beacon ID or serial number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batteryLevel">Battery Level</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DesktopLayout>
  )
}
