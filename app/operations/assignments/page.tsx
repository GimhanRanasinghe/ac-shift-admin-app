"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import user data
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

export default function OperatorAssignments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Filter assignments based on search and filters
  const filteredAssignments = assignmentsData.filter((assignment) => {
    const matchesSearch =
      searchQuery === "" ||
      assignment.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && assignment.date === new Date().toISOString().split("T")[0]) ||
      (dateFilter === "tomorrow" &&
        assignment.date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]) ||
      (dateFilter === "thisWeek" && new Date(assignment.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesStatus && matchesDate
  })

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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search assignments..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
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
                          <TableHead>Date</TableHead>
                          <TableHead>Shift</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssignments.length > 0 ? (
                          filteredAssignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell>{assignment.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={assignment.operatorId === "AC100000" ? "/profile-photo.png" : undefined}
                                      alt={assignment.operatorName}
                                    />
                                    <AvatarFallback>
                                      {assignment.operatorName
                                        .split(" ")
                                        .map((n) => n[0])
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
                              <TableCell>{new Date(assignment.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {assignment.shift}
                                </div>
                              </TableCell>
                              <TableCell>{assignment.location}</TableCell>
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
                                  {assignment.status === "active"
                                    ? "Active"
                                    : assignment.status === "scheduled"
                                      ? "Scheduled"
                                      : "Completed"}
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

        <Card>
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
                  <div className="text-2xl font-bold">{assignmentsData.length}</div>
                  <p className="text-xs text-muted-foreground">All assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {assignmentsData.filter((a) => a.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently active assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {assignmentsData.filter((a) => a.status === "scheduled").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Upcoming assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Equipment Assigned</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(assignmentsData.map((a) => a.equipmentId)).size}</div>
                  <p className="text-xs text-muted-foreground">Unique equipment pieces</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
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
                <strong>Date:</strong> {new Date(selectedAssignment.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Shift:</strong> {selectedAssignment.shift}
              </p>
              <p>
                <strong>Location:</strong> {selectedAssignment.location}
              </p>
              <p>
                <strong>Duration:</strong> {selectedAssignment.duration}
              </p>
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
                  {selectedAssignment.status === "active"
                    ? "Active"
                    : selectedAssignment.status === "scheduled"
                      ? "Scheduled"
                      : "Completed"}
                </Badge>
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false)
                  setIsEditModalOpen(true)
                }}
              >
                Edit
              </Button>
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
