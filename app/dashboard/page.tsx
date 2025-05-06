"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Clock,
  Download,
  Truck,
  Users,
  Wrench,
} from "lucide-react"

// Sample data for charts
const equipmentStatusData = [
  { name: "Available", value: 68 },
  { name: "In Use", value: 45 },
  { name: "Maintenance", value: 12 },
  { name: "Out of Service", value: 5 },
]

const utilizationData = [
  { name: "Jan", baggage: 65, belt: 48, pushback: 72, container: 55 },
  { name: "Feb", baggage: 59, belt: 42, pushback: 68, container: 51 },
  { name: "Mar", baggage: 80, belt: 61, pushback: 74, container: 67 },
  { name: "Apr", baggage: 81, belt: 64, pushback: 79, container: 70 },
  { name: "May", baggage: 76, belt: 58, pushback: 82, container: 68 },
  { name: "Jun", baggage: 85, belt: 65, pushback: 87, container: 74 },
]

const maintenanceData = [
  { name: "Week 1", scheduled: 12, unscheduled: 5 },
  { name: "Week 2", scheduled: 15, unscheduled: 7 },
  { name: "Week 3", scheduled: 10, unscheduled: 4 },
  { name: "Week 4", scheduled: 14, unscheduled: 6 },
]

const COLORS = ["#4ade80", "#60a5fa", "#f97316", "#f43f5e"]

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("week")

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Last updated: Today, 10:30 AM
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">130</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  1.5%
                </Badge>
                <span className="ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+3.2% from last month</p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  4.1%
                </Badge>
                <span className="ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Personnel</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">-3 from last month</p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  1.2%
                </Badge>
                <span className="ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$42,580</div>
              <p className="text-xs text-muted-foreground">-$1,200 from last month</p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  2.8%
                </Badge>
                <span className="ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Current status of all GSE equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equipmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {equipmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Equipment Utilization</CardTitle>
                <CardDescription>Utilization rates by equipment type</CardDescription>
              </div>
              <Tabs defaultValue="week" value={timeframe} onValueChange={setTimeframe}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="baggage" name="Baggage Tractors" fill="#4ade80" />
                    <Bar dataKey="belt" name="Belt Loaders" fill="#60a5fa" />
                    <Bar dataKey="pushback" name="Pushback Tractors" fill="#f97316" />
                    <Bar dataKey="container" name="Container Loaders" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Overview</CardTitle>
              <CardDescription>Scheduled vs. unscheduled maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={maintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="scheduled" name="Scheduled" stroke="#4ade80" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="unscheduled" name="Unscheduled" stroke="#f43f5e" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Recent system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium">Maintenance Overdue</h4>
                    <p className="text-sm text-muted-foreground">
                      5 pieces of equipment have overdue maintenance schedules
                    </p>
                    <div className="mt-2 flex items-center">
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <h4 className="font-medium">Certification Expiring</h4>
                    <p className="text-sm text-muted-foreground">
                      12 operators have certifications expiring in the next 30 days
                    </p>
                    <div className="mt-2 flex items-center">
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">New Equipment Added</h4>
                    <p className="text-sm text-muted-foreground">2 new baggage tractors have been added to the fleet</p>
                    <div className="mt-2 flex items-center">
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesktopLayout>
  )
}
