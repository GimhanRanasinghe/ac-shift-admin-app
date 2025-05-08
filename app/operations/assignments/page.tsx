"use client"

import { useState, useEffect } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { AddAssignmentModal } from "@/components/operations/add-assignment-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Clock,
  Truck,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

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
const generateAssignments = () => {
  const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Night (10PM-6AM)"]
  const statuses = ["active", "scheduled", "completed"]
  const locations = ["Terminal 1", "Terminal 3", "Cargo Area", "Maintenance Bay"]

  return Array(20)
    .fill(null)
    .map((_, index) => ({
      id: `ASG${10000 + index}`,
      operatorId: `AC${100000 + (index % 10)}`,
      operatorName: index % 10 === 0 ? userData.name : `Operator ${(index % 10) + 1}`,
      equipmentId: equipmentData[index % equipmentData.length].id,
      equipmentType: equipmentData[index % equipmentData.length].type,
      shift: shifts[index % 3],
      date: new Date(Date.now() + (index % 14) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: statuses[index % 3],
      location: locations[index % 4],
      duration: `${4 + (index % 4)} hours`,
    }))
}

const assignmentsData = generateAssignments()

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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

    return params
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchCounts().catch(err => console.error('Error fetching counts:', err))
  }, [])

  // Fetch list when filters change
  useEffect(() => {
    fetchList().catch(err => console.error('Error fetching assignments:', err))
  }, [currentPage, itemsPerPage, statusFilter, dateFilter, searchQuery])

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

  // Map API assignments to UI model
  const displayAssignments = listResponse?.items.map(mapToUiAssignment) || []

  // Loading state
  const isLoading = countsLoading || listLoading

  // Use sample data as fallback if API fails or during development
  const fallbackAssignments = assignmentsData.map(assignment => ({
    id: assignment.id,
    operatorId: assignment.operatorId,
    operatorName: assignment.operatorName,
    operatorEmail: "user@example.com",
    equipmentId: assignment.equipmentId,
    equipmentType: assignment.equipmentType,
    equipmentModel: "Model XYZ",
    status: assignment.status,
    startTime: assignment.date + " 08:00",
    endTime: assignment.date + " 16:00",
    taskType: "Equipment Use",
    priority: "medium",
  }))

  // Use API data if available, otherwise use fallback
  const assignments = displayAssignments.length > 0 ? displayAssignments : fallbackAssignments

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
                    <Select defaultValue="all" onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="thisWeek">This Week</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active ({counts?.active || 0})</SelectItem>
                        <SelectItem value="scheduled">Scheduled ({counts?.scheduled || 0})</SelectItem>
                        <SelectItem value="completed">Completed ({counts?.completed || 0})</SelectItem>
                        {counts?.cancelled && counts.cancelled > 0 && (
                          <SelectItem value="cancelled">Cancelled ({counts.cancelled})</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full items-center gap-2 md:w-auto">
                      <div className="relative w-full md:w-[300px]">
                        {isLoading ? (
                          <div className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        ) : (
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                          type="search"
                          placeholder={isLoading ? "Loading assignments..." : "Search assignments..."}
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
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
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
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
