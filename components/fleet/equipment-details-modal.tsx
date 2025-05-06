"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, PenToolIcon as Tool, Truck, Zap } from "lucide-react"

interface EquipmentDetailsModalProps {
  equipment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentDetailsModal({ equipment, open, onOpenChange }: EquipmentDetailsModalProps) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Equipment {equipment.id}
          </DialogTitle>
          <DialogDescription>
            {equipment.type} - {equipment.category}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="sensors">Sensors & Telematics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div>
                  <Badge
                    variant="outline"
                    className={
                      equipment.status === "Available"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : equipment.status === "In Use"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {equipment.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {equipment.distance} from terminal
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Last Maintenance</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {equipment.lastMaintenance}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Next Maintenance</p>
                <p className="flex items-center gap-1">
                  <Tool className="h-4 w-4 text-muted-foreground" />
                  {equipment.nextMaintenance}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Acquisition Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {equipment.acquisitionDate || "Jan 15, 2020"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Last Used</p>
                <p className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {equipment.lastUsed || "2 days ago"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
                <p>{equipment.manufacturer || "TLD"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{equipment.model || "JET-16"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Year</p>
                <p>{equipment.year || "2019"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p>{equipment.serialNumber || "TLD-2019-45678"}</p>
              </div>

              {equipment.powerType && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Power Type</p>
                  <p className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    {equipment.powerType || "Electric"}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Max Capacity</p>
                <p>{equipment.maxCapacity || "7,500 kg"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Telematics Device</p>
                <p>{equipment.telematicsDevice ? "Installed" : "Not Installed"}</p>
                {equipment.telematicsDevice && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.telematicsSerial || "TD-98765"}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">BLE Beacon</p>
                <p>{equipment.bleBeacon ? "Installed" : "Not Installed"}</p>
                {equipment.bleBeacon && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.bleSerial || "BLE-12345"}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Level Sensor</p>
                <p>{equipment.levelSensor ? "Installed" : "Not Installed"}</p>
                {equipment.levelSensor && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.levelSensorSerial || "LS-54321"}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Temperature Sensor</p>
                <p>{equipment.tempSensor ? "Installed" : "Not Installed"}</p>
                {equipment.tempSensor && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.tempSensorSerial || "TS-67890"}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">AI Dashcam</p>
                <p>{equipment.aiDashcam ? "Installed" : "Not Installed"}</p>
                {equipment.aiDashcam && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.aiDashcamSerial || "AI-13579"}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Cameras</p>
                <p>{equipment.cameras ? "Installed" : "Not Installed"}</p>
                {equipment.cameras && (
                  <p className="text-xs text-muted-foreground">SN: {equipment.camerasSerial || "CAM-24680"}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
