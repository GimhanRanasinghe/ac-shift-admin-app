"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  equipmentType: string
  setEquipmentType: (value: string) => void
  aircraft: string
  setAircraft: (value: string) => void
  equipmentTypes: { value: string; label: string }[]
  aircraftTypes: { value: string; label: string }[]
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  equipmentType,
  setEquipmentType,
  aircraft,
  setAircraft,
  equipmentTypes,
  aircraftTypes,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search equipment by ID or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-aircanada-cardgray border-aircanada-lightgray text-white rounded-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={equipmentType} onValueChange={setEquipmentType}>
            <SelectTrigger className="bg-aircanada-cardgray border-aircanada-lightgray text-white rounded-2xl">
              <SelectValue placeholder="Equipment Type" />
            </SelectTrigger>
            <SelectContent className="bg-aircanada-cardgray border-aircanada-lightgray text-white rounded-2xl">
              {equipmentTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="focus:bg-aircanada-lightgray focus:text-white"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={aircraft} onValueChange={setAircraft}>
            <SelectTrigger className="bg-aircanada-cardgray border-aircanada-lightgray text-white rounded-2xl">
              <SelectValue placeholder="Aircraft Type" />
            </SelectTrigger>
            <SelectContent className="bg-aircanada-cardgray border-aircanada-lightgray text-white rounded-2xl">
              {aircraftTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="focus:bg-aircanada-lightgray focus:text-white"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
