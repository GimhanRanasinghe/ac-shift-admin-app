"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus, Calendar, Filter, List, CalendarRange, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaintenanceCalendarView } from "@/components/fleet/maintenance-calendar-view"
import { ScheduleMaintenanceModal } from "@/components/fleet/schedule-maintenance-modal"
import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays, format, isWithinInterval, parseISO } from "date-fns"
import { useFeatureFlags } from "@/context/feature-flags-context"

// API hooks and services
import { useApi } from "@/hooks/use-api"
import {
  maintenanceService,
  MaintenanceCounts,
  MaintenanceTaskItem,
  MaintenanceListResponse
} from "@/lib/services/maintenance-service"

// UI Maintenance Task model for internal use
interface UiMaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentType: string;
  maintenanceType: string;
  dueDate: string;
  status: string;
  assignedTo: string;
  priority: string;
  type: string;
}

export default function MaintenanceSchedule() {
  const router = useRouter()
  const { isFeatureEnabled } = useFeatureFlags()

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assignedToFilter, setAssignedToFilter] = useState<number | null>(null)
  const [currentView, setCurrentView] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState("list")
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // State for date filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [showDateFilter, setShowDateFilter] = useState(false)

  // Feature flags
  const scheduleMaintenanceEnabled = isFeatureEnabled("scheduleMaintenance")
  const exportDataEnabled = isFeatureEnabled("exportData")
  const calendarViewEnabled = isFeatureEnabled("calendarView")
  const dateRangeFilterEnabled = isFeatureEnabled("dateRangeFilter")
  const advancedFiltersEnabled = isFeatureEnabled("advancedFilters")

  // API calls
  const { data: counts, loading: countsLoading, error: countsError, execute: fetchCounts } = useApi<MaintenanceCounts>(
    () => maintenanceService.getCounts(),
    { all: 0, upcoming: 0, overdue: 0, completed: 0 },
    false
  )

  const { data: listResponse, loading: listLoading, error: listError, execute: fetchList } = useApi<MaintenanceListResponse>(
    () => maintenanceService.getList(buildListParams()),
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

    if (typeFilter !== "all") {
      params.type = typeFilter
    }

    if (priorityFilter !== "all") {
      params.priority = priorityFilter
    }

    if (assignedToFilter !== null) {
      params.assigned_to = assignedToFilter
    }

    if (searchQuery) {
      params.search = searchQuery
    }

    if (showDateFilter && dateRange?.from) {
      params.due_date_from = format(dateRange.from, "yyyy-MM-dd")
      if (dateRange.to) {
        params.due_date_to = format(dateRange.to, "yyyy-MM-dd")
      }
    }

    return params
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchCounts().catch(err => console.error('Error fetching counts:', err))
  }, [])

  // Fetch list when filters change
  useEffect(() => {
    fetchList().catch(err => console.error('Error fetching maintenance tasks:', err))
  }, [currentPage, itemsPerPage, statusFilter, typeFilter, priorityFilter, assignedToFilter, showDateFilter, dateRange])

  // Map API maintenance task to UI model
  const mapToUiMaintenanceTask = (item: MaintenanceTaskItem): UiMaintenanceTask => {
    return {
      id: item.id.toString(),
      equipmentId: item.equipment_id.toString(),
      equipmentType: item.equipment.type_name || "Unknown Type",
      maintenanceType: item.maintenance_type,
      dueDate: item.due_date,
      status: item.status || item.category || "upcoming",
      assignedTo: item.assigned_to ? `User ID: ${item.assigned_to}` : "Unassigned",
      priority: item.priority.toLowerCase(),
      type: item.type
    };
  }

  // Map API maintenance tasks to UI model
  const displayTasks = listResponse?.items.map(mapToUiMaintenanceTask) || []

  // Loading state
  const isLoading = countsLoading || listLoading

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule</h1>
          <div className="flex items-center gap-2">
            {calendarViewEnabled && (
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
                {viewMode === "list" ? (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar View
                  </>
                ) : (
                  <>
                    <List className="mr-2 h-4 w-4" />
                    List View
                  </>
                )}
              </Button>
            )}
            {exportDataEnabled && (
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
            {scheduleMaintenanceEnabled && (
              <Button onClick={() => setShowScheduleModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Maintenance Tasks</CardTitle>
                <CardDescription>View and manage scheduled and unscheduled maintenance</CardDescription>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
            {(countsError || listError) && (
              <div className="mt-2 text-sm text-red-500">Error loading maintenance data. Please try again.</div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Tabs defaultValue="all" value={currentView} onValueChange={(value) => {
                  setCurrentView(value);
                  setCurrentPage(1);
                  setStatusFilter(value);
                  // Update the dropdown status filter to match the tab
                }}>
                  <TabsList>
                    {isLoading ? (
                      // Skeleton loading for tabs
                      <>
                        <TabsTrigger value="all" disabled>
                          All Tasks (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" disabled>
                          Upcoming (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="overdue" disabled>
                          Overdue (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                        <TabsTrigger value="completed" disabled>
                          Completed (<div className="inline-block h-3 w-4 animate-pulse rounded bg-gray-200"></div>)
                        </TabsTrigger>
                      </>
                    ) : (
                      <>
                        <TabsTrigger value="all">All Tasks ({counts?.all || 0})</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming ({counts?.upcoming || 0})</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue ({counts?.overdue || 0})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({counts?.completed || 0})</TabsTrigger>
                      </>
                    )}
                  </TabsList>
                </Tabs>

                {/* Active filters indicators */}
                {!isLoading && (statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all' || assignedToFilter !== null) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="text-xs text-muted-foreground">Active filters:</div>

                    {/* Status filter badge */}
                    {statusFilter !== 'all' && (
                      <Badge
                        variant="outline"
                        className={
                          statusFilter === "upcoming"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : statusFilter === "overdue"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
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

                    {/* Type filter badge */}
                    {typeFilter !== 'all' && (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        Type: {typeFilter}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setTypeFilter('all');
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {/* Priority filter badge */}
                    {priorityFilter !== 'all' && (
                      <Badge
                        variant="outline"
                        className={
                          priorityFilter === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : priorityFilter === "medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setPriorityFilter('all');
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
                      placeholder={isLoading ? "Loading maintenance data..." : "Search maintenance tasks..."}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {dateRangeFilterEnabled && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant={showDateFilter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        disabled={isLoading}
                      >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        {showDateFilter ? "Date Filter (On)" : "Date Filter"}
                      </Button>

                      {showDateFilter && (
                        <Button variant="ghost" size="icon" onClick={() => setShowDateFilter(false)} className="h-8 w-8" type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {advancedFiltersEnabled && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                          setStatusFilter(value);
                          // Update the tab to match the dropdown status filter
                          setCurrentView(value);
                        }}
                        disabled={isLoading}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="started">Started</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={typeFilter} onValueChange={setTypeFilter} disabled={isLoading}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="unscheduled">Unscheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter} disabled={isLoading}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {showDateFilter && (
                <div className="mb-4">
                  <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                </div>
              )}

              {viewMode === "list" ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
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
                              <div className="h-3 w-20 mt-1 animate-pulse rounded bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                            </TableCell>
                            <TableCell>
                              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : displayTasks.length > 0 ? (
                        displayTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.id}</TableCell>
                            <TableCell className="font-medium">
                             {task.equipmentType}
                            </TableCell>
                            <TableCell>
                            {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                           </TableCell>
                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  task.status === "upcoming"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : task.status === "overdue"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  task.priority === "high"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : task.priority === "medium"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.assignedTo}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No maintenance tasks found matching your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <MaintenanceCalendarView maintenanceData={displayTasks} />
              )}

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

      {scheduleMaintenanceEnabled && (
        <ScheduleMaintenanceModal open={showScheduleModal} onOpenChange={setShowScheduleModal} />
      )}
    </DesktopLayout>
  )
}
