"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { getEquipmentClass, getEquipmentClassIcon } from "@/utils/equipment-class"

interface Equipment {
  id: string
  type: string
  category: string
  code: string
  powerType: string
  aircraftCompatibility: string
  location: { lat: number; lng: number }
  distance: string
  status: string
  lastUsed: string
  certificationRequired: string
}

interface EquipmentListItemProps {
  equipment: Equipment
  hasCertification: (certificationRequired: string) => boolean
}

export function EquipmentListItem({ equipment, hasCertification }: EquipmentListItemProps) {
  const router = useRouter()
  const equipClass = getEquipmentClass(equipment.category, equipment.powerType)
  const ClassIcon = getEquipmentClassIcon(equipClass)

  const handleEquipmentAction = (equipmentId: string, action: "checkout" | "reserve") => {
    router.push(`/equipment/checkout/${equipmentId}`)
  }

  return (
    <Card className="bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-white">{equipment.type}</CardTitle>
            <span className="equipment-class equipment-class-blue">{equipClass}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {hasCertification(equipment.certificationRequired) ? (
                    <div className="text-status-green">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="text-status-amber">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-aircanada-darkgray text-white border-aircanada-lightgray rounded-xl">
                  <p>
                    {hasCertification(equipment.certificationRequired)
                      ? "You are certified to use this equipment"
                      : `Certification required: ${equipment.certificationRequired}`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge
            className={
              equipment.status === "Available"
                ? "bg-gray-600 text-white rounded-full hover:bg-gray-600"
                : equipment.status === "Maintenance"
                  ? "bg-gray-600 text-white rounded-full hover:bg-gray-600"
                  : "bg-gray-600 text-white rounded-full hover:bg-gray-600"
            }
          >
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-400">ID</p>
            <p className="font-medium text-white">{equipment.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Distance</p>
            <p className="font-medium text-white">{equipment.distance}</p>
          </div>
          <div>
            <p className="text-gray-400">Aircraft</p>
            <p className="text-white">{equipment.aircraftCompatibility}</p>
          </div>
          <div>
            <p className="text-gray-400">Power Type</p>
            <p className="text-white">{equipment.powerType}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button
            className="w-full bg-aircanada-blue hover:bg-blue-600 text-white rounded-full"
            onClick={() => handleEquipmentAction(equipment.id, "checkout")}
            disabled={equipment.status !== "Available" || !hasCertification(equipment.certificationRequired)}
          >
            Reserve / Check Out
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
