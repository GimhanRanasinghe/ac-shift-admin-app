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
import { Separator } from "@/components/ui/separator"

interface EquipmentTypeDetailsModalProps {
  equipmentType: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentTypeDetailsModal({ equipmentType, open, onOpenChange }: EquipmentTypeDetailsModalProps) {
  if (!equipmentType) {
    // Return early if no equipment type is provided
    if (open) {
      console.error("Equipment type details modal opened with no equipment type data")
      onOpenChange(false)
    }
    return null
  }

  const categoryLabels: Record<string, string> = {
    towing: "Towing Equipment",
    loading: "Loading Equipment",
    support: "Support Equipment",
    service: "Service Equipment",
    other: "Other Equipment",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{equipmentType.label}</DialogTitle>
          <DialogDescription>Equipment type details and specifications</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Type ID:</span>
            <span>{equipmentType.value}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Category:</span>
            <span>{categoryLabels[equipmentType.category]}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Power Type:</span>
            <Badge
              variant="outline"
              className={
                equipmentType.isPowered
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }
            >
              {equipmentType.isPowered ? "Powered" : "Non-Powered"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Maintenance Interval:</span>
            <span>{equipmentType.maintenanceInterval} days</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Required Certification:</span>
            <span>{equipmentType.requiredCertification}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Active Units:</span>
            <span>{equipmentType.activeUnits || 0}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Last Updated:</span>
            <span>{equipmentType.lastUpdated || "N/A"}</span>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{equipmentType.description || "No description available."}</p>
          </div>

          {equipmentType.isPowered && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Compatible Sensors</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Telematics Device</li>
                  <li>Level Sensor</li>
                  <li>Temperature Sensor</li>
                  {equipmentType.category === "towing" && <li>AI Dashcam</li>}
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
