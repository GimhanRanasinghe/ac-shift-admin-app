"use client"

import { useState, useEffect } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { AddAssignmentModal } from "@/components/operations/add-assignment-modal"
import { Button } from "@/components/ui/button"

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
import {
  Download,
  MoreHorizontal,
  Plus,
  Calendar as CalendarIcon,
  Truck,
  X,
  Clock,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// API hooks and services
import { useApi } from "@/hooks/use-api"
import {
  equipmentAssignmentService,
  AssignmentCounts,
  AssignmentListItem,
  AssignmentListResponse
} from "@/lib/services/equipment-assignment-service"

// Import user data for fallback
import userData from "@/data/user.json"
import equipmentData from "@/data/equipment.json"

// Create sample assignments data
// const generateAssignments = () => {
//   const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Night (10PM-6AM)"]
//   const statuses = ["active", "scheduled", "completed"]
//   const locations = ["Terminal 1", "Terminal 3", "Cargo Area", "Maintenance Bay"]

//   return Array(20)
//     .fill(null)
//     .map((_, index) => ({
//       id: `ASG${10000 + index}`,
//       operatorId: `AC${100000 + (index % 10)}`,
//       operatorName: index % 10 === 0 ? userData.name : `Operator ${(index % 10) + 1}`,
//       equipmentId: equipmentData[index % equipmentData.length].id,
//       equipmentType: equipmentData[index % equipmentData.length].type,
//       shift: shifts[index % 3],
//       date: new Date(Date.now() + (index % 14) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//       status: statuses[index % 3],
//       location: locations[index % 4],
//       duration: `${4 + (index % 4)} hours`,
//     }))
// }

// const assignmentsData = generateAssignments()

// UI Assignment model for internal use
interface UiAssignment {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorEmail: string;
  equipmentId: string;
  equipmentType: string;
  equipmentModel: string;
  status: string;
  startTime: string;
  endTime: string;
  taskType: string;
  priority: string;
  checkInTime?: string;
  returnTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
}

export default function OperatorAssignments() {
  // State for filters and pagination
  const [searchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentView, setCurrentView] = useState("all")
  const [dateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // State for date range filter
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(),
    to: new Date(),
  })
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  const [showDateFilter, setShowDateFilter] = useState(true)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Feature flags
  const dateRangeFilterEnabled = true

  // State for modals
  const [selectedAssignment, setSelectedAssignment] = useState<UiAssignment | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Feature flags
  const editAssignmentEnabled = true

  // API calls
  const { data: counts, loading: countsLoading, execute: fetchCounts } = useApi<AssignmentCounts>(
    () => equipmentAssignmentService.getCounts(),
    { total: 0, scheduled: 0, active: 0, completed: 0 },
    false
  )

  const { data: listResponse, loading: listLoading, execute: fetchList } = useApi<AssignmentListResponse>(
    () => equipmentAssignmentService.getList(buildListParams()),
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

    if (searchQuery) {
      params.equipment_name = searchQuery
      params.username = searchQuery
    }

    if (dateFilter !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dateFilter === "today") {
        params.start_time_from = format(today, "yyyy-MM-dd")
        params.start_time_to = format(today, "yyyy-MM-dd")
      } else if (dateFilter === "tomorrow") {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        params.start_time_from = format(tomorrow, "yyyy-MM-dd")
        params.start_time_to = format(tomorrow, "yyyy-MM-dd")
      } else if (dateFilter === "thisWeek") {
        const endOfWeek = new Date(today)
        endOfWeek.setDate(endOfWeek.getDate() + 7)
        params.start_time_from = format(today, "yyyy-MM-dd")
        params.start_time_to = format(endOfWeek, "yyyy-MM-dd")
      }
    }

    // Add date range filter if active
    if (showDateFilter && dateRange.from && dateRange.to) {
      // Create dates with time
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)

      // Apply time to dates
      const [startHours, startMinutes] = startTime.split(':')
      const [endHours, endMinutes] = endTime.split(':')

      fromDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0)
      toDate.setHours(parseInt(endHours), parseInt(endMinutes), 59, 999)

      params.start_time_from = format(fromDate, "yyyy-MM-dd'T'HH:mm:ss")
      params.start_time_to = format(toDate, "yyyy-MM-dd'T'HH:mm:ss")
    }

    return params
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchCounts().catch(err => console.error('Error fetching counts:', err))
  }, [])

  // Fetch list when filters change
  useEffect(() => {
    fetchList().catch(err => console.error('Error fetching assignments:', err))
  }, [currentPage, itemsPerPage, statusFilter, dateFilter, searchQuery, showDateFilter, dateRange])

  // Update currentView when statusFilter changes
  useEffect(() => {
    setCurrentView(statusFilter)
  }, [statusFilter])

  // Map API assignment to UI model
  const mapToUiAssignment = (item: AssignmentListItem): UiAssignment => {
    return {
      id: item.id.toString(),
      operatorId: item.operator?.id.toString() || "N/A",
      operatorName: item.operator?.username || "Unassigned",
      operatorEmail: item.operator?.email || "N/A",
      equipmentId: item.equipment_id.toString(),
      equipmentType: item.equipment?.type_name || "Unknown Type",
      equipmentModel: item.equipment?.model || "Unknown Model",
      status: item.status,
      startTime: item.start_time ? format(new Date(item.start_time), "yyyy-MM-dd HH:mm") : "N/A",
      endTime: item.end_time ? format(new Date(item.end_time), "yyyy-MM-dd HH:mm") : "N/A",
      taskType: item.task_type || "N/A",
      priority: item.priority || "medium",
      checkInTime: item.check_in_time ? format(new Date(item.check_in_time), "yyyy-MM-dd HH:mm") : undefined,
      returnTime: item.return_time ? format(new Date(item.return_time), "yyyy-MM-dd HH:mm") : undefined,
      actualStartTime: item.actual_start_time ? format(new Date(item.actual_start_time), "yyyy-MM-dd HH:mm") : undefined,
      actualEndTime: item.actual_end_time ? format(new Date(item.actual_end_time), "yyyy-MM-dd HH:mm") : undefined,
    };
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
      case 'scheduled':
        setStatusFilter('scheduled');
        break;
      case 'active':
        setStatusFilter('active');
        break;
      case 'completed':
        setStatusFilter('completed');
        break;
      case 'cancelled':
        setStatusFilter('cancelled');
        break;
      default:
        setStatusFilter('all');
    }
  }

  // Reset date filter
  const resetDateFilter = () => {
    const today = new Date()
    setDateRange({ from: today, to: today })
    setShowDateFilter(false)
  }

  // Apply date filter
  const applyDateFilter = () => {
    // If no dates are selected, set to current date
    if (!dateRange.from || !dateRange.to) {
      const today = new Date()
      setDateRange({
        from: today,
        to: today,
      })
    }

    // Apply the filter
    setShowDateFilter(true)
    setIsCalendarOpen(false)
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

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }

  // Time options for select dropdown
  const timeOptions = generateTimeOptions()

  // Map API assignments to UI model
  const displayAssignments = listResponse?.items.map(mapToUiAssignment) || []

  // Loading state
  const isLoading = countsLoading || listLoading

  // // Use sample data as fallback if API fails or during development
  // const fallbackAssignments = assignmentsData.map(assignment => ({
  //   id: assignment.id,
  //   operatorId: assignment.operatorId,
  //   operatorName: assignment.operatorName,
  //   operatorEmail: "user@example.com",
  //   equipmentId: assignment.equipmentId,
  //   equipmentType: assignment.equipmentType,
  //   equipmentModel: "Model XYZ",
  //   status: assignment.status,
  //   startTime: assignment.date + " 08:00",
  //   endTime: assignment.date + " 16:00",
  //   taskType: "Equipment Use",
  //   priority: "medium",
  // }))

  // Use API data if available, otherwise use fallback
  const assignments = displayAssignments.length > 0 ? displayAssignments : []

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Equipment Assignments</h1>
          <div className="flex items-center gap-2">
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
                <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                <DropdownMenuItem>Export to PDF</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Operator Assignments</CardTitle>
                    <CardDescription>Manage equipment assignments for ground service operators</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* <Select defaultValue="all" onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[140px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="thisWeek">This Week</SelectItem>
                      </SelectContent>
                    </Select> */}

                    {/* {dateRangeFilterEnabled && (
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
                                  {format(dateRange.from, "MMM d, yyyy")} {startTime} - {format(dateRange.to, "MMM d, yyyy")} {endTime}
                                </>
                              ) : (
                                <span>Date & Time Range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-3 border-b">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Filter by start date</h4>
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
                            <div className="border-t border-border p-3 space-y-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Time Range</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                                  <Select value={startTime} onValueChange={setStartTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Start time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeOptions.map((time) => (
                                        <SelectItem key={`start-${time}`} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">End Time</Label>
                                  <Select value={endTime} onValueChange={setEndTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeOptions.map((time) => (
                                        <SelectItem key={`end-${time}`} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
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
                    )} */}
                  </div>
                </div>
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
                              All Assignments (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                            </TabsTrigger>
                            <TabsTrigger value="scheduled" disabled>
                              Scheduled (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                            </TabsTrigger>
                            <TabsTrigger value="active" disabled>
                              Active (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                            </TabsTrigger>
                            <TabsTrigger value="completed" disabled>
                              Completed (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                            </TabsTrigger>
                            {counts?.cancelled && counts.cancelled > 0 && (
                              <TabsTrigger value="cancelled" disabled>
                                Cancelled (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                              </TabsTrigger>
                            )}
                          </>
                        ) : (
                          <>
                            <TabsTrigger value="all">All Assignments ({counts?.total || 0})</TabsTrigger>
                            <TabsTrigger value="scheduled">Scheduled ({counts?.scheduled || 0})</TabsTrigger>
                            <TabsTrigger value="active">Active ({counts?.active || 0})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({counts?.completed || 0})</TabsTrigger>
                            {counts?.cancelled && counts.cancelled > 0 && (
                              <TabsTrigger value="cancelled">Cancelled ({counts.cancelled})</TabsTrigger>
                            )}
                          </>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full items-center gap-2 md:w-auto">
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
                                  {format(dateRange.from, "MMM d, yyyy")} {startTime} - {format(dateRange.to, "MMM d, yyyy")} {endTime}
                                </>
                              ) : (
                                <span>Date & Time Range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-3 border-b">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Filter by start date</h4>
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
                                // If no range is selected, use current date
                                if (!range?.from && !range?.to) {
                                  const today = new Date()
                                  setDateRange({
                                    from: today,
                                    to: today,
                                  })
                                } else {
                                  setDateRange({
                                    from: range?.from,
                                    to: range?.to,
                                  })
                                }
                              }}
                              numberOfMonths={1}
                              defaultMonth={dateRange.from || new Date()}
                              showOutsideDays={true}
                              fixedWeeks={true}
                              ISOWeek={false}
                              captionLayout="dropdown"
                            />
                            <div className="border-t border-border p-3 space-y-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Time Range</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                                  <Select value={startTime} onValueChange={setStartTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Start time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeOptions.map((time) => (
                                        <SelectItem key={`start-${time}`} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">End Time</Label>
                                  <Select value={endTime} onValueChange={setEndTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeOptions.map((time) => (
                                        <SelectItem key={`end-${time}`} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
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

                        {/* {showDateFilter && (
                          <Button variant="ghost" size="icon" onClick={resetDateFilter} className="h-8 w-8" type="button">
                            <X className="h-4 w-4" />
                          </Button>
                        )} */}
                      </div>
                    )}
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment ID</TableHead>
                          <TableHead>Operator</TableHead>
                          <TableHead>Equipment</TableHead>
                          <TableHead>Start DateTime</TableHead>
                          <TableHead>End DateTime</TableHead>
                          <TableHead>Task Type</TableHead>
                          <TableHead>Status</TableHead>
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
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                                  <div>
                                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                                    <div className="h-3 w-20 mt-1 animate-pulse rounded bg-gray-200"></div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </TableCell>
                              <TableCell>
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </TableCell>
                              <TableCell>
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </TableCell>
                              <TableCell>
                                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                              </TableCell>
                              <TableCell>
                                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                              </TableCell>
                              <TableCell>
                                <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : assignments.length > 0 ? (
                          assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell>{assignment.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {assignment.operatorName
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{assignment.operatorName}</p>
                                    <p className="text-xs text-muted-foreground">{assignment.operatorId}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p>{assignment.equipmentType}</p>
                                    <p className="text-xs text-muted-foreground">{assignment.equipmentId}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{assignment.startTime !== "N/A" ? assignment.startTime.split(" ")[0] + " " + assignment.startTime.split(" ")[1] : "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
                                  {assignment.startTime !== "N/A" ? assignment.endTime.split(" ")[0] + " " + assignment.endTime.split(" ")[1] : "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>{assignment.taskType}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    assignment.status === "active"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : assignment.status === "scheduled"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                  }
                                >
                                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAssignment(assignment)
                                        setIsViewModalOpen(true)
                                      }}
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAssignment(assignment)
                                        setIsEditModalOpen(true)
                                      }}
                                    >
                                      Edit Assignment
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className={assignment.status === "completed" ? "text-gray-400" : "text-blue-600"}
                                      disabled={assignment.status === "completed"}
                                    >
                                      {assignment.status === "active" ? "Mark as Completed" : "Activate Assignment"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Cancel Assignment</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No assignments found matching your filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {!isLoading && listResponse && listResponse.total_pages > 1 && (
                      <div className="flex items-center justify-between mt-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Calendar</CardTitle>
                <CardDescription>View assignments in calendar format</CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Calendar view would display assignments in a daily, weekly, or monthly format.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* <Card>
          <CardHeader>
            <CardTitle>Assignment Statistics</CardTitle>
            <CardDescription>Overview of current equipment assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">All assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts?.active || 0}</div>
                  <p className="text-xs text-muted-foreground">Currently active assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts?.scheduled || 0}</div>
                  <p className="text-xs text-muted-foreground">Upcoming assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Equipment Assigned</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(listResponse?.items.map((a) => a.equipment_id) || []).size}</div>
                  <p className="text-xs text-muted-foreground">Unique equipment pieces</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* View Assignment Modal */}
      {selectedAssignment && isViewModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Assignment Details</h2>
            <div className="space-y-3">
              <p>
                <strong>Assignment ID:</strong> {selectedAssignment.id}
              </p>
              <p>
                <strong>Operator:</strong> {selectedAssignment.operatorName} ({selectedAssignment.operatorId})
              </p>
              <p>
                <strong>Equipment:</strong> {selectedAssignment.equipmentType} ({selectedAssignment.equipmentId})
              </p>
              <p>
                <strong>Start Time:</strong> {selectedAssignment.startTime}
              </p>
              <p>
                <strong>End Time:</strong> {selectedAssignment.endTime}
              </p>
              <p>
                <strong>Task Type:</strong> {selectedAssignment.taskType}
              </p>
              <p>
                <strong>Priority:</strong> {selectedAssignment.priority}
              </p>
              {selectedAssignment.checkInTime && (
                <p>
                  <strong>Check-in Time:</strong> {selectedAssignment.checkInTime}
                </p>
              )}
              {selectedAssignment.returnTime && (
                <p>
                  <strong>Return Time:</strong> {selectedAssignment.returnTime}
                </p>
              )}
              {selectedAssignment.actualStartTime && (
                <p>
                  <strong>Actual Start Time:</strong> {selectedAssignment.actualStartTime}
                </p>
              )}
              {selectedAssignment.actualEndTime && (
                <p>
                  <strong>Actual End Time:</strong> {selectedAssignment.actualEndTime}
                </p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  variant="outline"
                  className={
                    selectedAssignment.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedAssignment.status === "scheduled"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment.status.slice(1)}
                </Badge>
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              {editAssignmentEnabled && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    setIsEditModalOpen(true)
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {selectedAssignment && isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>
            <p className="mb-4">This would be an edit form for assignment {selectedAssignment.id}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Changes would be saved here")
                  setIsEditModalOpen(false)
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      <AddAssignmentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </DesktopLayout>
  )
}
