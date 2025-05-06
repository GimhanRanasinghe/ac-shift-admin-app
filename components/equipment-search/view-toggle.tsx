"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, List } from "lucide-react"

interface ViewToggleProps {
  viewMode: string
  setViewMode: (value: string) => void
  equipmentCount: number
}

export function ViewToggle({ viewMode, setViewMode, equipmentCount }: ViewToggleProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-400">Found {equipmentCount} equipment items</div>
      <div className="flex items-center gap-4">
        <Tabs defaultValue="map" value={viewMode} onValueChange={setViewMode}>
          <TabsList className="grid grid-cols-2 w-[200px] bg-aircanada-darkgray rounded-full">
            <TabsTrigger
              value="map"
              className={viewMode === "map" ? "bg-aircanada-blue text-white rounded-full" : "text-white"}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className={viewMode === "list" ? "bg-aircanada-blue text-white rounded-full" : "text-white"}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
