"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus, Calendar, Filter, List, CalendarRange } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaintenanceCalendarView } from "@/components/fleet/maintenance-calendar-view"
import { ScheduleMaintenanceModal } from "@/components/fleet/schedule-maintenance-modal"
import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays, isWithinInterval, parseISO } from "date-fns"

// Sample maintenance schedule data
const maintenanceData = [
  {
    id: "M-1001",
    equipmentId: "BTG-1045",
    equipmentType: "Baggage Tractor",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-15",
    status: "upcoming",
    assignedTo: "John Smith",
    priority: "medium",
  },
  {
    id: "M-1002",
    equipmentId: "BLW-0872",
    equipmentType: "Belt Loader",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-18",
    status: "upcoming",
    assignedTo: "Sarah Johnson",
    priority: "high",
  },
  {
    id: "M-1003",
    equipmentId: "ATF-0023",
    equipmentType: "Pushback Tractor",
    maintenanceType: "Unscheduled",
    dueDate: "2024-05-10",
    status: "overdue",
    assignedTo: "Unassigned",
    priority: "high",
  },
  {
    id: "M-1004",
    equipmentId: "GPB-0789",
    equipmentType: "Ground Power Unit",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-25",
    status: "upcoming",
    assignedTo: "Mike Davis",
    priority: "low",
  },
  {
    id: "M-1005",
    equipmentId: "CLS-0456",
    equipmentType: "Container Loader",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-12",
    status: "overdue",
    assignedTo: "Unassigned",
    priority: "medium",
  },
  {
    id: "M-1006",
    equipmentId: "LTL-0234",
    equipmentType: "Lavatory Truck",
    maintenanceType: "Unscheduled",
    dueDate: "2024-05-20",
    status: "upcoming",
    assignedTo: "Emily Wilson",
    priority: "medium",
  },
  {
    id: "M-1007",
    equipmentId: "BTG-2178",
    equipmentType: "Baggage Tractor",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-28",
    status: "upcoming",
    assignedTo: "John Smith",
    priority: "medium",
  },
  {
    id: "M-1008",
    equipmentId: "PBT-0567",
    equipmentType: "Pushback Tractor",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-05",
    status: "completed",
    assignedTo: "Alex Johnson",
    priority: "high",
  },
  {
    id: "M-1009",
    equipmentId: "WTR-0123",
    equipmentType: "Water Truck",
    maintenanceType: "Scheduled",
    dueDate: "2024-05-08",
    status: "completed",
    assignedTo: "Maria Rodriguez",
    priority: "medium",
  },
]

export default function MaintenanceSchedule() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [showDateFilter, setShowDateFilter] = useState(false)

  // Filter maintenance data based on search, filters, and date range
  const filteredData = maintenanceData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipmentType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.maintenanceType === typeFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange?.from && showDateFilter) {
      const itemDate = parseISO(item.dueDate)
      if (dateRange.to) {
        matchesDateRange = isWithinInterval(itemDate, {
          start: dateRange.from,
          end: dateRange.to,
        })
      } else {
        // If only "from" date is selected
        matchesDateRange = itemDate >= dateRange.from
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesDateRange
  })

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule</h1>
          <div className="flex items-center gap-2">
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
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setShowScheduleModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>View and manage scheduled and unscheduled maintenance</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={showDateFilter ? "bg-blue-50" : ""}
            >
              <CalendarRange className="mr-2 h-4 w-4" />
              Date Filter {showDateFilter ? "(On)" : "(Off)"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Tasks ({maintenanceData.length})</TabsTrigger>
                  <TabsTrigger value="upcoming">
                    Upcoming ({maintenanceData.filter((item) => item.status === "upcoming").length})
                  </TabsTrigger>
                  <TabsTrigger value="overdue">
                    Overdue ({maintenanceData.filter((item) => item.status === "overdue").length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({maintenanceData.filter((item) => item.status === "completed").length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
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
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
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
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>
                              {item.equipmentId}
                              <div className="text-xs text-muted-foreground">{item.equipmentType}</div>
                            </TableCell>
                            <TableCell>{item.maintenanceType}</TableCell>
                            <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  item.status === "upcoming"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : item.status === "overdue"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  item.priority === "high"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : item.priority === "medium"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.assignedTo}</TableCell>
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
                <MaintenanceCalendarView maintenanceData={filteredData} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ScheduleMaintenanceModal open={showScheduleModal} onOpenChange={setShowScheduleModal} />
    </DesktopLayout>
  )
}
