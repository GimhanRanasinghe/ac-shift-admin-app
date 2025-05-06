"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Download, Calendar, FileSpreadsheet, FileIcon as FilePdf, Printer } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for utilization charts
const dailyUtilizationData = [
  { hour: "00:00", utilization: 15 },
  { hour: "02:00", utilization: 10 },
  { hour: "04:00", utilization: 8 },
  { hour: "06:00", utilization: 25 },
  { hour: "08:00", utilization: 65 },
  { hour: "10:00", utilization: 85 },
  { hour: "12:00", utilization: 78 },
  { hour: "14:00", utilization: 82 },
  { hour: "16:00", utilization: 75 },
  { hour: "18:00", utilization: 68 },
  { hour: "20:00", utilization: 45 },
  { hour: "22:00", utilization: 25 },
]

const weeklyUtilizationData = [
  { day: "Monday", utilization: 72 },
  { day: "Tuesday", utilization: 68 },
  { day: "Wednesday", utilization: 75 },
  { day: "Thursday", utilization: 82 },
  { day: "Friday", utilization: 85 },
  { day: "Saturday", utilization: 45 },
  { day: "Sunday", utilization: 38 },
]

const monthlyUtilizationData = [
  { month: "Jan", utilization: 65 },
  { month: "Feb", utilization: 59 },
  { month: "Mar", utilization: 80 },
  { month: "Apr", utilization: 81 },
  { month: "May", utilization: 76 },
  { month: "Jun", utilization: 85 },
  { month: "Jul", utilization: 88 },
  { month: "Aug", utilization: 84 },
  { month: "Sep", utilization: 78 },
  { month: "Oct", utilization: 75 },
  { month: "Nov", utilization: 70 },
  { month: "Dec", utilization: 68 },
]

const equipmentTypeUtilization = [
  { name: "Baggage Tractors", value: 82 },
  { name: "Belt Loaders", value: 75 },
  { name: "Pushback Tractors", value: 88 },
  { name: "Container Loaders", value: 65 },
  { name: "Ground Power Units", value: 72 },
]

const utilizationByAircraft = [
  { name: "Boeing 787", baggage: 85, belt: 70, pushback: 90, container: 75 },
  { name: "Boeing 777", baggage: 88, belt: 72, pushback: 92, container: 78 },
  { name: "Airbus A330", baggage: 82, belt: 68, pushback: 85, container: 72 },
  { name: "Airbus A320", baggage: 75, belt: 65, pushback: 80, container: 60 },
  { name: "Boeing 737", baggage: 78, belt: 68, pushback: 82, container: 62 },
]

const COLORS = ["#4ade80", "#60a5fa", "#f97316", "#f43f5e", "#a855f7"]

export default function UtilizationAnalytics() {
  const [timeframe, setTimeframe] = useState("daily")
  const [equipmentType, setEquipmentType] = useState("all")
  const [airport, setAirport] = useState("YYZ")

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Equipment Utilization</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
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
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Average Utilization</CardTitle>
              <CardDescription>Overall equipment utilization rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-5xl font-bold">76.5%</div>
                <p className="text-sm text-muted-foreground">+3.2% from previous period</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Peak Utilization</CardTitle>
              <CardDescription>Highest equipment utilization rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-5xl font-bold">92.8%</div>
                <p className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Idle Time</CardTitle>
              <CardDescription>Average equipment idle time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-5xl font-bold">23.5%</div>
                <p className="text-sm text-muted-foreground">-2.8% from previous period</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Utilization Over Time</CardTitle>
              <CardDescription>Equipment utilization rates over different time periods</CardDescription>
            </div>
            <Tabs defaultValue="daily" value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {timeframe === "daily" ? (
                  <AreaChart data={dailyUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="utilization" name="Utilization" stroke="#4ade80" fill="#4ade8080" />
                  </AreaChart>
                ) : timeframe === "weekly" ? (
                  <BarChart data={weeklyUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilization" name="Utilization" fill="#60a5fa" />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="utilization"
                      name="Utilization"
                      stroke="#f97316"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Utilization by Equipment Type</CardTitle>
              <CardDescription>Breakdown of utilization rates by equipment category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equipmentTypeUtilization}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {equipmentTypeUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilization by Aircraft Type</CardTitle>
              <CardDescription>Equipment utilization rates by aircraft type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationByAircraft}>
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
      </div>
    </DesktopLayout>
  )
}
