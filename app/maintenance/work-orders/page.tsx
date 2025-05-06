"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample work orders data
const workOrdersData = [
  {
    id: "WO-1001",
    equipmentId: "BTG-1045",
    equipmentType: "Baggage Tractor",
    description: "Engine oil change and filter replacement",
    priority: "medium",
    status: "open",
    assignedTo: "John Smith",
    createdDate: "2024-05-01",
    dueDate: "2024-05-10",
  },
  {
    id: "WO-1002",
    equipmentId: "BLW-0872",
    equipmentType: "Belt Loader",
    description: "Hydraulic system inspection and fluid top-up",
    priority: "high",
    status: "in-progress",
    assignedTo: "Sarah Johnson",
    createdDate: "2024-05-02",
    dueDate: "2024-05-08",
  },
  {
    id: "WO-1003",
    equipmentId: "ATF-0023",
    equipmentType: "Pushback Tractor",
    description: "Brake system overhaul",
    priority: "high",
    status: "parts-ordered",
    assignedTo: "Mike Davis",
    createdDate: "2024-05-03",
    dueDate: "2024-05-12",
  },
  {
    id: "WO-1004",
    equipmentId: "GPB-0789",
    equipmentType: "Ground Power Unit",
    description: "Generator maintenance and testing",
    priority: "medium",
    status: "open",
    assignedTo: "Unassigned",
    createdDate: "2024-05-04",
    dueDate: "2024-05-15",
  },
  {
    id: "WO-1005",
    equipmentId: "CLS-0456",
    equipmentType: "Container Loader",
    description: "Electrical system troubleshooting",
    priority: "high",
    status: "in-progress",
    assignedTo: "Emily Wilson",
    createdDate: "2024-05-05",
    dueDate: "2024-05-09",
  },
  {
    id: "WO-1006",
    equipmentId: "LTL-0234",
    equipmentType: "Lavatory Truck",
    description: "Pump system maintenance",
    priority: "low",
    status: "completed",
    assignedTo: "Robert Brown",
    createdDate: "2024-04-28",
    dueDate: "2024-05-05",
    completedDate: "2024-05-04",
  },
]

export default function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter work orders based on search and filters
  const filteredData = workOrdersData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Work Order
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Maintenance Work Orders</CardTitle>
            <CardDescription>View and manage equipment maintenance work orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search work orders..."
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
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="parts-ordered">Parts Ordered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          {item.equipmentId}
                          <div className="text-xs text-muted-foreground">{item.equipmentType}</div>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
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
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.status === "open"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : item.status === "in-progress"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : item.status === "parts-ordered"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                            }
                          >
                            {item.status === "in-progress"
                              ? "In Progress"
                              : item.status === "parts-ordered"
                                ? "Parts Ordered"
                                : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.assignedTo}</TableCell>
                        <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  )
}
