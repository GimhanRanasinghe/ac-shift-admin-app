import { EquipmentListItem } from "./equipment-list-item"

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

interface EquipmentListProps {
  equipment: Equipment[]
  hasCertification: (certificationRequired: string) => boolean
}

export function EquipmentList({ equipment, hasCertification }: EquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <div className="text-center p-8 bg-aircanada-darkgray rounded-lg border border-aircanada-lightgray">
        <p className="text-gray-300">No equipment found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map((item) => (
        <EquipmentListItem key={item.id} equipment={item} hasCertification={hasCertification} />
      ))}
    </div>
  )
}
