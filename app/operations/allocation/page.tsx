"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  RefreshCw,
  Save,
  Download,
  Settings,
  Clock,
  Calendar,
  BarChart,
  Map,
  List,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useData } from "@/context/data-context"

export default function ResourceAllocation() {
  const { equipment } = useData()
  const [optimizationStatus, setOptimizationStatus] = useState<"idle" | "running" | "completed" | "failed">("idle")
  const [viewMode, setViewMode] = useState("map")
  const [searchQuery, setSearchQuery] = useState("")
  const [equipmentFilter, setEquipmentFilter] = useState("all")

  // Sample optimization results
  const optimizationResults = {
    score: {
      hard: 0,
      soft: -2450,
      total: -2450,
    },
    metrics: {
      totalDistance: 245.8,
      totalTime: 18.5,
      equipmentUtilization: 87.5,
      co2Emissions: 42.3,
    },
    routes: [
      {
        equipmentId: "BTG-1045",
        equipmentType: "Baggage Tractor",
        driver: "John Smith",
        tasks: [
          { id: "T1", location: "Terminal 1, Gate A3", startTime: "08:15", endTime: "08:45", flight: "AC123" },
          { id: "T2", location: "Terminal 1, Gate B2", startTime: "09:00", endTime: "09:30", flight: "AC456" },
          { id: "T3", location: "Terminal 3, Gate C1", startTime: "10:15", endTime: "10:45", flight: "AC789" },
        ],
        distance: 4.2,
        time: 2.5,
      },
      {
        equipmentId: "BLW-0872",
        equipmentType: "Belt Loader",
        driver: "Sarah Johnson",
        tasks: [
          { id: "T4", location: "Terminal 1, Gate A3", startTime: "08:20", endTime: "09:00", flight: "AC123" },
          { id: "T5", location: "Terminal 3, Gate C1", startTime: "10:20", endTime: "11:00", flight: "AC789" },
        ],
        distance: 3.8,
        time: 1.8,
      },
      {
        equipmentId: "ATF-0023",
        equipmentType: "Pushback Tractor",
        driver: "Mike Davis",
        tasks: [
          { id: "T6", location: "Terminal 1, Gate A3", startTime: "09:10", endTime: "09:25", flight: "AC123" },
          { id: "T7", location: "Terminal 1, Gate B2", startTime: "09:45", endTime: "10:00", flight: "AC456" },
          { id: "T8", location: "Terminal 3, Gate C1", startTime: "11:10", endTime: "11:25", flight: "AC789" },
        ],
        distance: 5.1,
        time: 2.2,
      },
    ],
    unassignedTasks: [
      { id: "T9", location: "Terminal 3, Gate D2", startTime: "11:30", endTime: "12:00", flight: "AC101", reason: "No available equipment" },
    ],
    constraints: {
      violated: [
        { type: "Hard", description: "Equipment certification requirement not met", count: 0 },
        { type: "Hard", description: "Time window violation", count: 0 },
      ],
      penalized: [
        { type: "Soft", description: "Minimize travel distance", score: -1250 },
        { type: "Soft", description: "Maximize equipment utilization", score: -850 },
        { type: "Soft", description: "Minimize CO2 emissions", score: -350 },
      ],
    },
  }

  const handleStartOptimization = () => {
    setOptimizationStatus("running")

    // Simulate optimization process
    setTimeout(() => {
      setOptimizationStatus("completed")
    }, 3000)
  }

  const handleStopOptimization = () => {
    setOptimizationStatus("idle")
  }

  const handleResetOptimization = () => {
    setOptimizationStatus("idle")
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Resource Allocation</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              May 15, 2024
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Optimization Settings
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Plan
            </Button>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Optimization Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {optimizationStatus === "idle" && (
                  <div className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                {optimizationStatus === "running" && (
                  <div className="h-8 w-8 rounded-full border-2 border-blue-300 flex items-center justify-center mr-2">
                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  </div>
                )}
                {optimizationStatus === "completed" && (
                  <div className="h-8 w-8 rounded-full border-2 border-green-300 flex items-center justify-center mr-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {optimizationStatus === "failed" && (
                  <div className="h-8 w-8 rounded-full border-2 border-red-300 flex items-center justify-center mr-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {optimizationStatus === "idle" && "Ready to Optimize"}
                    {optimizationStatus === "running" && "Optimization Running"}
                    {optimizationStatus === "completed" && "Optimization Complete"}
                    {optimizationStatus === "failed" && "Optimization Failed"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {optimizationStatus === "idle" && "Click Start to begin optimization"}
                    {optimizationStatus === "running" && "Calculating optimal routes and assignments..."}
                    {optimizationStatus === "completed" && "Solution found with score: -2450"}
                    {optimizationStatus === "failed" && "Error: Could not find feasible solution"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {optimizationStatus === "idle" && (
                  <Button className="w-full" onClick={handleStartOptimization}>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                )}
                {optimizationStatus === "running" && (
                  <Button className="w-full" variant="destructive" onClick={handleStopOptimization}>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                )}
                {(optimizationStatus === "completed" || optimizationStatus === "failed") && (
                  <Button className="w-full" variant="outline" onClick={handleResetOptimization}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipment.filter(e => e.status === "Available").length}</div>
              <p className="text-xs text-muted-foreground">Out of {equipment.length} total equipment</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(equipment.filter(e => e.status === "Available").length / equipment.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {Math.round((equipment.filter(e => e.status === "Available").length / equipment.length) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>38 assigned</span>
                <span>4 unassigned</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(38 / 42) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {Math.round((38 / 42) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Optimization Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Distance:</span>
                  <span className="font-medium">{optimizationResults.metrics.totalDistance} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Time:</span>
                  <span className="font-medium">{optimizationResults.metrics.totalTime} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Equipment Utilization:</span>
                  <span className="font-medium">{optimizationResults.metrics.equipmentUtilization}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CO₂ Emissions:</span>
                  <span className="font-medium">{optimizationResults.metrics.co2Emissions} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Optimized Resource Plan</CardTitle>
                <CardDescription>Equipment and task assignments optimized by Timefold AI</CardDescription>
              </div>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value="gantt">
                    <BarChart className="h-4 w-4 mr-2" />
                    Gantt View
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
                      placeholder="Search equipment or tasks..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Equipment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="baggage">Baggage Tractors</SelectItem>
                      <SelectItem value="belt">Belt Loaders</SelectItem>
                      <SelectItem value="pushback">Pushback Tractors</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {viewMode === "list" && (
                <div className="space-y-4">
                  {optimizationResults.routes.map((route) => (
                    <Card key={route.equipmentId} className="overflow-hidden">
                      <CardHeader className="pb-2 bg-muted/50">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{route.equipmentType}: {route.equipmentId}</CardTitle>
                            <CardDescription>Driver: {route.driver}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">Distance: {route.distance} km</div>
                            <div className="text-sm text-muted-foreground">Time: {route.time} hours</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Task ID</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Flight</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {route.tasks.map((task) => (
                                <TableRow key={task.id}>
                                  <TableCell className="font-medium">{task.id}</TableCell>
                                  <TableCell>{task.location}</TableCell>
                                  <TableCell>{task.startTime}</TableCell>
                                  <TableCell>{task.endTime}</TableCell>
                                  <TableCell>{task.flight}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {optimizationResults.unassignedTasks.length > 0 && (
                    <Card className="border-red-200">
                      <CardHeader className="pb-2 bg-red-50">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <CardTitle className="text-lg text-red-700">Unassigned Tasks</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Task ID</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Flight</TableHead>
                                <TableHead>Reason</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {optimizationResults.unassignedTasks.map((task) => (
                                <TableRow key={task.id}>
                                  <TableCell className="font-medium">{task.id}</TableCell>
                                  <TableCell>{task.location}</TableCell>
                                  <TableCell>{task.startTime}</TableCell>
                                  <TableCell>{task.endTime}</TableCell>
                                  <TableCell>{task.flight}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      {task.reason}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {viewMode === "map" && (
                <div className="h-[500px] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Map view would display optimized routes and equipment locations</p>
                    <p className="text-sm text-muted-foreground mt-2">Integrated with Mapbox for real-time visualization</p>
                  </div>
                </div>
              )}

              {viewMode === "gantt" && (
                <div className="h-[500px] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Gantt chart would display task schedules and equipment assignments</p>
                    <p className="text-sm text-muted-foreground mt-2">Timeline visualization of all operations</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Constraints</CardTitle>
            <CardDescription>Hard and soft constraints used in the optimization model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Hard Constraints</h3>
                <div className="space-y-2">
                  {optimizationResults.constraints.violated.map((constraint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        {constraint.count === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span>{constraint.description}</span>
                      </div>
                      <Badge variant={constraint.count === 0 ? "outline" : "destructive"}>
                        {constraint.count} violations
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Soft Constraints</h3>
                <div className="space-y-2">
                  {optimizationResults.constraints.penalized.map((constraint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <span>{constraint.description}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Score: {constraint.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  )
}
