"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Printer,
  X,
  CalendarIcon,
} from "lucide-react"

// Add these imports at the top of the file
import { EquipmentDetailsModal } from "@/components/fleet/equipment-details-modal"
import { EditEquipmentModal } from "@/components/fleet/edit-equipment-modal"
import { MaintenanceHistoryModal } from "@/components/fleet/maintenance-history-modal"
import { DecommissionEquipmentModal } from "@/components/fleet/decommission-equipment-modal"
import { AddEquipmentModal } from "@/components/fleet/add-equipment-modal"
import { useData } from "@/context/data-context"
import { useFeatureFlags } from "@/context/feature-flags-context"
// Add these imports at the top of the file
import { format, parseISO, isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { Equipment, equipmentService } from "@/lib/services/equipment-service"

export default function FleetInventory() {
  const router = useRouter()
  const { equipment } = useData()
  const { isFeatureEnabled } = useFeatureFlags()

  // Fetch equipment data from API with immediate=false to prevent automatic fetching
  const { data: apiEquipment, loading, error, execute: fetchEquipment } = useApi<Equipment[]>(
    () => equipmentService.getAll(),
    [],
    false // Don't fetch immediately
  )

  // Use useEffect with empty dependency array to fetch data only once when component mounts
  useEffect(() => {
    // Only fetch once when component mounts
    fetchEquipment().catch(err => {
      console.error('Error fetching equipment:', err);
    });
  }, []) // Empty dependency array ensures this runs only once

  // Map API equipment to UI equipment model
  const mappedEquipment = apiEquipment ? apiEquipment.map((item) => ({
    id: item.id.toString(),
    type: getEquipmentType(item.equipment_type_id),
    category: "Powered Equipment", // Hard-coded value
    code: item.serial_number,
    powerType: "Diesel", // Hard-coded value
    aircraftCompatibility: "All", // Hard-coded value
    location: { lat: 0, lng: 0 }, // Hard-coded value
    distance: "100m", // Hard-coded value
    status: getEquipmentStatus(item), // Determine status based on maintenance dates
    lastUsed: formatDate(item.updated_at),
    lastMaintenance: formatDate(item.last_maintenance_date),
    nextMaintenance: formatDate(item.next_maintenance_date),
    certificationRequired: "Basic GSE", // Hard-coded value
  })) : [];

  // Helper function to get equipment type based on type ID
  function getEquipmentType(typeId: number): string {
    const types: Record<number, string> = {
      1: "Baggage Tractor",
      2: "Belt Loader",
      3: "Pushback Tractor",
      4: "Container Loader",
      5: "Ground Power Unit"
    };
    return types[typeId] || "Unknown Equipment";
  }

  // Helper function to determine equipment status
  function getEquipmentStatus(item: Equipment): string {
    const now = new Date();
    const nextMaintenance = new Date(item.next_maintenance_date);

    if (nextMaintenance < now) {
      return "Maintenance";
    }

    // Randomly assign "Available" or "In Use" for demo purposes
    return Math.random() > 0.5 ? "Available" : "In Use";
  }

  // Helper function to format dates
  function formatDate(dateString: string): string {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "N/A";
    }
  }

  // Use the mapped equipment or fall back to mock data if API fails
  const displayEquipment = apiEquipment && apiEquipment.length > 0 ? mappedEquipment : [];

  // Check feature flags
  const addEquipmentEnabled = isFeatureEnabled("addEquipment")
  const editEquipmentEnabled = isFeatureEnabled("editEquipment")
  const exportDataEnabled = isFeatureEnabled("exportData")
  const decommissionEquipmentEnabled = isFeatureEnabled("decommissionEquipment")
  const maintenanceHistoryEnabled = isFeatureEnabled("maintenanceHistory")
  const dateRangeFilterEnabled = isFeatureEnabled("dateRangeFilter")
  const advancedFiltersEnabled = isFeatureEnabled("advancedFilters")

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentView, setCurrentView] = useState("all")

  // Add these state variables inside the FleetInventory component, after the existing useState declarations
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showDecommissionModal, setShowDecommissionModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  // Add these state variables inside the FleetInventory component, after the existing useState declarations
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Filter equipment based on search and filters
  const filteredEquipment = displayEquipment.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesType = typeFilter === "all" || item.type.toLowerCase().includes(typeFilter.toLowerCase())

    const matchesView =
      currentView === "all" ||
      (currentView === "maintenance" && item.status === "Maintenance") ||
      (currentView === "available" && item.status === "Available") ||
      (currentView === "in-use" && item.status === "In Use")

    // Add date range filtering
    let matchesDateRange = true
    if (showDateFilter && dateRange.from && dateRange.to) {
      try {
        const lastMaintenanceDate = parseISO(item.lastMaintenance)
        matchesDateRange = isWithinInterval(lastMaintenanceDate, {
          start: dateRange.from,
          end: dateRange.to,
        })
      } catch (error) {
        console.error("Error parsing date:", error)
        matchesDateRange = true
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesView && matchesDateRange
  })

  // Get unique equipment types for filter
  const equipmentTypes = Array.from(new Set(displayEquipment.map((item) => item.type)))

  // Get counts for tabs
  const availableCount = displayEquipment.filter((item) => item.status === "Available").length
  const inUseCount = displayEquipment.filter((item) => item.status === "In Use").length
  const maintenanceCount = displayEquipment.filter((item) => item.status === "Maintenance").length

  // Add a function to reset date filters
  const resetDateFilter = () => {
    setDateRange({ from: undefined, to: undefined })
    setShowDateFilter(false)
  }

  // Apply date filter
  const applyDateFilter = () => {
    if (dateRange.from && dateRange.to) {
      setShowDateFilter(true)
      setIsCalendarOpen(false)
    }
  }

  // Set preset date ranges
  const setPresetDateRange = (days: number) => {
    const today = new Date()
    const pastDate = new Date()
    pastDate.setDate(today.getDate() - days)

    setDateRange({
      from: pastDate,
      to: today,
    })
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Fleet Inventory</h1>
          <div className="flex items-center gap-2">
            {exportDataEnabled && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FilePdf className="mr-2 h-4 w-4" />
                    Export to PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {addEquipmentEnabled && (
              <Button onClick={() => router.push("/fleet/onboarding")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>Manage and monitor all ground service equipment in the fleet</CardDescription>
            {/* {loading && <div className="mt-2 text-sm text-muted-foreground">Loading equipment data...</div>}
            {error && <div className="mt-2 text-sm text-red-500">Error loading equipment data. Using mock data instead.</div>}
            {apiEquipment && apiEquipment.length > 0 && (
              <div className="mt-2 text-sm text-green-500">Loaded {apiEquipment.length} equipment items from API</div>
            )} */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs defaultValue="all" value={currentView} onValueChange={setCurrentView}>
                <TabsList>
                  <TabsTrigger value="all">All Equipment ({displayEquipment.length})</TabsTrigger>
                  <TabsTrigger value="available">Available ({availableCount})</TabsTrigger>
                  <TabsTrigger value="in-use">In Use ({inUseCount})</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance ({maintenanceCount})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
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

                  {/* Date Range Picker */}
                  {dateRangeFilterEnabled && (
                    <div className="flex items-center gap-2">
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={showDateFilter ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "justify-start text-left font-normal",
                              !dateRange.from && !dateRange.to && "text-muted-foreground",
                            )}
                            onClick={() => setIsCalendarOpen(true)}
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                              <>
                                {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                              </>
                            ) : (
                              <span>Date Range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 border-b">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Filter by maintenance date</h4>
                              <div className="flex gap-2 flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  type="button"
                                  onClick={() => {
                                    const today = new Date()
                                    setDateRange({
                                      from: today,
                                      to: today,
                                    })
                                  }}
                                >
                                  Today
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  type="button"
                                  onClick={() => setPresetDateRange(7)}
                                >
                                  Last 7 days
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  type="button"
                                  onClick={() => setPresetDateRange(30)}
                                >
                                  Last 30 days
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  type="button"
                                  onClick={() => setPresetDateRange(90)}
                                >
                                  Last 90 days
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Calendar
                            mode="range"
                            selected={{
                              from: dateRange.from,
                              to: dateRange.to,
                            }}
                            onSelect={(range) => {
                              setDateRange({
                                from: range?.from,
                                to: range?.to,
                              })
                            }}
                            numberOfMonths={2}
                            defaultMonth={dateRange.from}
                          />
                          <div className="p-3 border-t flex justify-between">
                            <Button variant="ghost" size="sm" type="button" onClick={resetDateFilter}>
                              Reset
                            </Button>
                            <Button size="sm" type="button" onClick={applyDateFilter}>
                              Apply
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {showDateFilter && (
                        <Button variant="ghost" size="icon" onClick={resetDateFilter} className="h-8 w-8" type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {advancedFiltersEnabled && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" type="button">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="p-2">
                            <p className="mb-1 text-xs font-medium">Equipment Type</p>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {equipmentTypes.map((type) => (
                                  <SelectItem key={type} value={type.toLowerCase()}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-2">
                            <p className="mb-1 text-xs font-medium">Status</p>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="in use">In Use</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" size="icon" type="button">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.length > 0 ? (
                      filteredEquipment.map((equipment) => (
                        <TableRow key={equipment.id}>
                          <TableCell className="font-medium">{equipment.id}</TableCell>
                          <TableCell>{equipment.type}</TableCell>
                          <TableCell>{equipment.category}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>{equipment.lastMaintenance}</TableCell>
                          <TableCell>{equipment.nextMaintenance}</TableCell>
                          <TableCell>{equipment.distance} from terminal</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" type="button">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEquipment(equipment)
                                    setShowDetailsModal(true)
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                {editEquipmentEnabled && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedEquipment(equipment)
                                      setShowEditModal(true)
                                    }}
                                  >
                                    Edit Equipment
                                  </DropdownMenuItem>
                                )}
                                {maintenanceHistoryEnabled && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedEquipment(equipment)
                                      setShowMaintenanceModal(true)
                                    }}
                                  >
                                    Maintenance History
                                  </DropdownMenuItem>
                                )}
                                {decommissionEquipmentEnabled && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        setSelectedEquipment(equipment)
                                        setShowDecommissionModal(true)
                                      }}
                                    >
                                      Decommission
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No equipment found matching the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <EquipmentDetailsModal equipment={selectedEquipment} open={showDetailsModal} onOpenChange={setShowDetailsModal} />

      {editEquipmentEnabled && (
        <EditEquipmentModal equipment={selectedEquipment} open={showEditModal} onOpenChange={setShowEditModal} />
      )}

      {maintenanceHistoryEnabled && (
        <MaintenanceHistoryModal
          equipment={selectedEquipment}
          open={showMaintenanceModal}
          onOpenChange={setShowMaintenanceModal}
        />
      )}

      {decommissionEquipmentEnabled && (
        <DecommissionEquipmentModal
          equipment={selectedEquipment}
          open={showDecommissionModal}
          onOpenChange={setShowDecommissionModal}
        />
      )}

      {addEquipmentEnabled && <AddEquipmentModal open={showAddModal} onOpenChange={setShowAddModal} />}
    </DesktopLayout>
  )
}
