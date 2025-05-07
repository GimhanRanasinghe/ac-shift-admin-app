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

// Component imports
import { EquipmentDetailsModal } from "@/components/fleet/equipment-details-modal"
import { EditEquipmentModal } from "@/components/fleet/edit-equipment-modal"
import { MaintenanceHistoryModal } from "@/components/fleet/maintenance-history-modal"
import { DecommissionEquipmentModal } from "@/components/fleet/decommission-equipment-modal"
import { AddEquipmentModal } from "@/components/fleet/add-equipment-modal"
import { useFeatureFlags } from "@/context/feature-flags-context"

// Date handling
import { format, parseISO, isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// API hooks and services
import { useApi } from "@/hooks/use-api"
import {
  equipmentInventoryService,
  EquipmentCounts,
  EquipmentListItem,
  EquipmentListResponse,
  EquipmentTypeResponse
} from "@/lib/services/equipment-inventory-service"
// import { console } from "inspector"

// UI Equipment model for internal use
interface UiEquipment {
  id: string;
  type: string;
  class: string;
  code: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  distance: string;
}

export default function FleetInventory() {
  const router = useRouter()
  const { isFeatureEnabled } = useFeatureFlags()

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState<number | null>(null)
  const [currentView, setCurrentView] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State for modals
  const [selectedEquipment, setSelectedEquipment] = useState<UiEquipment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showDecommissionModal, setShowDecommissionModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // State for date filter
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Feature flags
  const addEquipmentEnabled = isFeatureEnabled("addEquipment")
  const editEquipmentEnabled = isFeatureEnabled("editEquipment")
  const exportDataEnabled = isFeatureEnabled("exportData")
  const decommissionEquipmentEnabled = isFeatureEnabled("decommissionEquipment")
  const maintenanceHistoryEnabled = isFeatureEnabled("maintenanceHistory")
  const dateRangeFilterEnabled = isFeatureEnabled("dateRangeFilter")
  const advancedFiltersEnabled = isFeatureEnabled("advancedFilters")

  // API calls
  const { data: counts, loading: countsLoading, error: countsError, execute: fetchCounts } = useApi<EquipmentCounts>(
    () => equipmentInventoryService.getCounts(),
    { total: 0, available: 0, in_use: 0, maintenance: 0 },
    false
  )

  // const { data: typesResponse, loading: typesLoading, error: typesError, execute: fetchTypes } = useApi<EquipmentTypeResponse>(
  //   () => equipmentInventoryService.getTypes(),
  //   { types: [] },
  //   false
  // )

  const { data: listResponse, loading: listLoading, error: listError, execute: fetchList } = useApi<EquipmentListResponse>(
    () => equipmentInventoryService.getList(buildListParams()),
    {
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 1
    },
    false
  )

  // Build params for list API
  const buildListParams = () => {
    const params: any = {
      page: currentPage,
      page_size: itemsPerPage,
    }

    if (statusFilter !== "all") {
      params.status = statusFilter
    }

    if (typeFilter !== null) {
      params.equipment_type_id = typeFilter
    }

    // if (searchQuery) {
    //   params.search = searchQuery
    // }

    if (showDateFilter && dateRange.from && dateRange.to) {
      params.last_maintenance_from = format(dateRange.from, "yyyy-MM-dd")
      params.last_maintenance_to = format(dateRange.to, "yyyy-MM-dd")
    }
    console.log(params);
    return params
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchCounts().catch(err => console.error('Error fetching counts:', err))
    // fetchTypes().catch(err => console.error('Error fetching types:', err))
  }, [])

  // Fetch list when filters change
  useEffect(() => {
    fetchList().catch(err => console.error('Error fetching equipment list:', err))
  }, [currentPage, itemsPerPage, statusFilter, typeFilter, showDateFilter, dateRange])

  // Map API equipment to UI model
  const mapToUiEquipment = (item: EquipmentListItem): UiEquipment => {
    // Get equipment type name from the equipment types array
    const equipmentType = equipmentTypes.find(type => type.id === item.id);
    // console.log(equipmentType);

    // Determine status based on maintenance dates if not provided
    let status = item.status;
    if (!status) {
      const now = new Date();
      const nextMaintenance = new Date(item.next_maintenance_date);
      if (nextMaintenance < now) {
        status = 'maintenance';
      } else {
        // Default to available
        status = 'available';
      }
    }

    return {
      id: item.id.toString(),
      type: item.type_name || equipmentType?.name || "Unknown Type",
      class: item.equipment_class || (item.is_powered ? "Powered Equipment" : "Non-powered Equipment"),
      code: item.serial_number,
      status: capitalizeFirstLetter((status || 'available').replace('_', ' ')),
      lastMaintenance: formatDate(item.last_maintenance_date),
      nextMaintenance: formatDate(item.next_maintenance_date),
      distance: item.distance || "N/A",
    };
  }

  // Helper function to format dates
  function formatDate(dateString: string): string {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "N/A"
    }
  }

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    setCurrentView(value);

    // Reset to page 1 when changing tabs
    setCurrentPage(1);

    // Update status filter based on selected tab
    switch (value) {
      case 'all':
        setStatusFilter('all');
        break;
      case 'available':
        setStatusFilter('available');
        break;
      case 'in-use':
        setStatusFilter('in-use');
        break;
      case 'maintenance':
        setStatusFilter('maintenance');
        break;
      default:
        setStatusFilter('all');
    }

    console.log(`Status filter updated to: ${value === 'in-use' ? 'in_use' : value}`);
  }

  // Reset date filter
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

  // Get equipment types for filter
  // const equipmentTypes = typesResponse?.types || []
  const equipmentTypes = [
    {
      "id": 1,
      "description": "test1",
      "capacity": 0,
      "specifications": {
        "spec": "test"
      },
      "class": "A",
      "is_powered": 0,
      "name": "Tractor"
    },
    {
      "id": 2,
      "description": "test2",
      "capacity": 0,
      "specifications": {},
      "class": "B",
      "is_powered": 1,
      "name": "Test1"
    },
    {
      "id": 3,
      "description": "test3",
      "capacity": 0,
      "specifications": {},
      "class": "C",
      "is_powered": 1,
      "name": "Test2"
    }
  ]


  // Map API equipment to UI model
  const displayEquipment = listResponse?.items.map(mapToUiEquipment) || []

  // Loading state
  let typesLoading = false
  const isLoading = countsLoading || typesLoading || listLoading

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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Equipment Inventory</CardTitle>
                <CardDescription>Manage and monitor all ground service equipment in the fleet</CardDescription>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
            {(countsError || listError) && (
              <div className="mt-2 text-sm text-red-500">Error loading equipment data. Please try again.</div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Tabs defaultValue="all" value={currentView} onValueChange={handleTabChange}>
                  <TabsList>
                    {isLoading ? (
                      // Skeleton loading for tabs
                      <>
                        <TabsTrigger value="all" disabled>
                          All Equipment (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="available" disabled>
                          Available (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="in-use" disabled>
                          In Use (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" disabled>
                          Maintenance (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                      </>
                    ) : (
                      <>
                        <TabsTrigger value="all">All Equipment ({counts?.total || 0})</TabsTrigger>
                        <TabsTrigger value="available">Available ({counts?.available || 0})</TabsTrigger>
                        <TabsTrigger value="in-use">In Use ({counts?.in_use || 0})</TabsTrigger>
                        <TabsTrigger value="maintenance">Maintenance ({counts?.maintenance || 0})</TabsTrigger>
                      </>
                    )}
                  </TabsList>
                </Tabs>

                {/* Active filters indicators */}
                {!isLoading && (statusFilter !== 'all' || typeFilter !== null) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="text-xs text-muted-foreground">Active filters:</div>

                    {/* Status filter badge */}
                    {statusFilter !== 'all' && (
                      <Badge
                        variant="outline"
                        className={
                          statusFilter === "available"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : statusFilter === "in_use"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        Status: {statusFilter === "in_use" ? "In Use" : capitalizeFirstLetter(statusFilter)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setStatusFilter('all');
                            setCurrentView('all');
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {/* Equipment type filter badge */}
                    {typeFilter !== null && (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        Type: {equipmentTypes.find(type => type.id === typeFilter)?.name || 'Unknown'}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setTypeFilter(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={isLoading ? "Loading equipment data..." : "Search equipment..."}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoading}
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
                            disabled={isLoading}
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
                            numberOfMonths={1}
                            defaultMonth={dateRange.from || new Date()}
                            showOutsideDays={true}
                            fixedWeeks={true}
                            ISOWeek={false}
                            captionLayout="dropdown"
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
                      {/* Calculate active filters */}
                      {(() => {
                        // Count active filters from dropdown only
                        let activeFilterCount = 0;
                        if (typeFilter !== null) activeFilterCount++;

                        return (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant={activeFilterCount > 0 ? "default" : "outline"}
                                  size="sm"
                                  type="button"
                                  disabled={isLoading}
                                  className="relative"
                                >
                                  <Filter className="h-4 w-4 mr-2" />
                                  Filters
                                  {activeFilterCount > 0 && (
                                    <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 inline-flex items-center justify-center text-xs">
                                      {activeFilterCount}
                                    </span>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[250px]">
                                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                                {activeFilterCount > 0 && (
                                  <div className="px-2 py-1 flex justify-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() => {
                                        setTypeFilter(null);
                                      }}
                                    >
                                      Clear Type Filter
                                    </Button>
                                  </div>
                                )}
                                <div className="p-2">
                                  <p className="mb-1 text-xs font-medium">Equipment Type</p>
                                  <Select
                                    value={typeFilter !== null ? typeFilter.toString() : "all"}
                                    onValueChange={(value) => setTypeFilter(value === "all" ? null : parseInt(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Types</SelectItem>
                                      {equipmentTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                          {type.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        );
                      })()}
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
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      {/* <TableHead>Location</TableHead> */}
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-28 animate-pulse rounded bg-gray-200"></div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                          </TableCell> */}
                        </TableRow>
                      ))
                    ) : displayEquipment.length > 0 ? (
                      displayEquipment.map((equipment: UiEquipment) => (
                        <TableRow key={equipment.id}>
                          <TableCell className="font-medium">{equipment.code}</TableCell>
                          <TableCell>{equipment.type}</TableCell>
                          <TableCell>{equipment.class}</TableCell>
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
                          {/* <TableCell>{equipment.distance}</TableCell> */}
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

              {/* Pagination */}
              {!isLoading && listResponse && listResponse.total_pages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(listResponse.page - 1) * listResponse.page_size + 1} to{" "}
                    {Math.min(listResponse.page * listResponse.page_size, listResponse.total)} of {listResponse.total} items
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {listResponse.page} of {listResponse.total_pages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, listResponse.total_pages))}
                      disabled={currentPage === listResponse.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
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
