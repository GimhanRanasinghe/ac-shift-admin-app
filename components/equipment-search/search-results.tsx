import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MapboxEquipmentMap } from "@/components/mapbox-equipment-map"
import { EquipmentList } from "./equipment-list"

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

interface SearchResultsProps {
  viewMode: string
  equipment: Equipment[]
  userCertifications: string[]
  hasCertification: (certificationRequired: string) => boolean
  locateId?: string | null
}

export function SearchResults({
  viewMode,
  equipment,
  userCertifications,
  hasCertification,
  locateId,
}: SearchResultsProps) {
  return (
    <Tabs defaultValue="map" value={viewMode}>
      <TabsContent value="map" className="mt-4">
        <div className="bg-aircanada-darkgray rounded-2xl border border-aircanada-lightgray overflow-hidden">
          <div className="h-[400px] w-full">
            <MapboxEquipmentMap equipment={equipment} userCertifications={userCertifications} locateId={locateId} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="list" className="mt-4 space-y-4">
        <EquipmentList equipment={equipment} hasCertification={hasCertification} />
      </TabsContent>
    </Tabs>
  )
}
