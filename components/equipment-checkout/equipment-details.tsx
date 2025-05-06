import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface Equipment {
  id: string
  type: string
  category: string
  code: string
  powerType: string
  aircraftCompatibility: string
  distance: string
  status: string
  lastUsed: string
  fuelLevel?: string
  batteryLevel?: string
  lastMaintenance: string
  nextMaintenance: string
  certificationRequired: string
}

interface EquipmentDetailsProps {
  equipment: Equipment
}

export function EquipmentDetails({ equipment }: EquipmentDetailsProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{equipment.type}</h2>
          <Badge variant="outline" className="rounded-full">
            {equipment.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Class</p>
            <p className="font-medium">
              <span className="equipment-class equipment-class-blue">
                {equipment.category === "Non-Powered Equipment"
                  ? "C"
                  : equipment.powerType.includes("Electric")
                    ? "B"
                    : "A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Power Type</p>
            <p className="font-medium">{equipment.powerType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Aircraft Compatibility</p>
            <p className="font-medium">{equipment.aircraftCompatibility}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="font-medium">{equipment.distance}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium text-green-800">Certification Verified</p>
            <p className="text-sm text-green-700">{equipment.certificationRequired}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Fuel Level</p>
            <p className="font-medium">{equipment.fuelLevel || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Battery Level</p>
            <p className="font-medium">{equipment.batteryLevel || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Maintenance</p>
            <p className="font-medium">{equipment.lastMaintenance}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Maintenance</p>
            <p className="font-medium">{equipment.nextMaintenance}</p>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-800">Safety Reminder</p>
            <p className="text-amber-700">
              Always perform a visual inspection before operating any ground service equipment.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
