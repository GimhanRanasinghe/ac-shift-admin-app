"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileSpreadsheet, FileIcon as FilePdf, Printer } from "lucide-react"
import {
  AreaChart,
  Area,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/context/data-context"

// Sample emissions data
const monthlyEmissionsData = [
  { month: "Jan", emissions: 42.5, target: 45 },
  { month: "Feb", emissions: 43.2, target: 45 },
  { month: "Mar", emissions: 45.1, target: 45 },
  { month: "Apr", emissions: 44.8, target: 44 },
  { month: "May", emissions: 43.5, target: 44 },
  { month: "Jun", emissions: 42.9, target: 44 },
  { month: "Jul", emissions: 44.2, target: 43 },
  { month: "Aug", emissions: 43.1, target: 43 },
  { month: "Sep", emissions: 41.8, target: 43 },
  { month: "Oct", emissions: 40.5, target: 42 },
  { month: "Nov", emissions: 39.7, target: 42 },
  { month: "Dec", emissions: 38.9, target: 42 },
]

const equipmentEmissionsData = [
  { name: "Baggage Tractors", value: 28, color: "#4ade80" },
  { name: "Belt Loaders", value: 15, color: "#60a5fa" },
  { name: "Pushback Tractors", value: 32, color: "#f97316" },
  { name: "Container Loaders", value: 18, color: "#f43f5e" },
  { name: "Ground Power Units", value: 7, color: "#a855f7" },
]

const COLORS = ["#4ade80", "#60a5fa", "#f97316", "#f43f5e", "#a855f7"]

export function CarbonFootprint() {
  const { equipment } = useData()
  const [timeframe, setTimeframe] = useState("month")
  const [year, setYear] = useState("2024")
  const [equipmentType, setEquipmentType] = useState("all")

  // Calculate total emissions
  const totalEmissions = monthlyEmissionsData.reduce((sum, item) => sum + item.emissions, 0)
  const averageMonthlyEmissions = totalEmissions / monthlyEmissionsData.length

  // Calculate year-over-year change
  const previousYearEmissions = 520 // Sample data
  const yearOverYearChange = ((totalEmissions - previousYearEmissions) / previousYearEmissions) * 100

  // Calculate emissions per equipment type
  const emissionsPerEquipment = equipmentEmissionsData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Carbon Footprint</h1>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂ Emissions</CardTitle>
            <CardDescription>Metric tons of CO₂ equivalent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {yearOverYearChange < 0 ? "Decreased" : "Increased"} by{" "}
              <span className={yearOverYearChange < 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(yearOverYearChange).toFixed(1)}%
              </span>{" "}
              compared to previous year
            </p>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(totalEmissions / 600) * 100}%` }}></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>Target: 500</span>
              <span>600</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Emissions</CardTitle>
            <CardDescription>Metric tons of CO₂ equivalent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMonthlyEmissions.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {averageMonthlyEmissions < 45 ? "Below" : "Above"} monthly target by{" "}
              <span className={averageMonthlyEmissions < 45 ? "text-green-500" : "text-red-500"}>
                {Math.abs(averageMonthlyEmissions - 45).toFixed(1)}
              </span>
            </p>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${averageMonthlyEmissions < 45 ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: `${(averageMonthlyEmissions / 60) * 100}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>Target: 45</span>
              <span>60</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emissions per Equipment</CardTitle>
            <CardDescription>Average CO₂ per equipment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emissionsPerEquipment.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Based on {equipment.length} active equipment items</p>
            <div className="mt-4 flex justify-between items-center">
              {equipmentEmissionsData.map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="h-16 w-3 rounded-t-sm"
                    style={{ backgroundColor: entry.color, height: `${(entry.value / 35) * 64}px` }}
                  ></div>
                  <span className="text-xs mt-1">{entry.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Monthly Emissions Trend</CardTitle>
                <CardDescription>CO₂ emissions vs. target</CardDescription>
              </div>
              <Tabs defaultValue="month" value={timeframe} onValueChange={setTimeframe}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyEmissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="emissions" name="CO₂ Emissions" stroke="#4ade80" fill="#4ade8080" />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#f43f5e" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Emissions by Equipment Type</CardTitle>
                <CardDescription>CO₂ contribution by equipment category</CardDescription>
              </div>
              <Select value={equipmentType} onValueChange={setEquipmentType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  <SelectItem value="powered">Powered Equipment</SelectItem>
                  <SelectItem value="non-powered">Non-Powered Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equipmentEmissionsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {equipmentEmissionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tons CO₂e`, "Emissions"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carbon Reduction Initiatives</CardTitle>
          <CardDescription>Ongoing and planned initiatives to reduce carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Electric GSE Transition</h3>
                <p className="text-sm text-muted-foreground">Replacing diesel equipment with electric alternatives</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">25% Complete</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Optimized Vehicle Routing</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered route optimization to reduce fuel consumption
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">60% Complete</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Solar Charging Stations</h3>
                <p className="text-sm text-muted-foreground">Installation of solar panels for charging electric GSE</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">15% Complete</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Idle Time Reduction</h3>
                <p className="text-sm text-muted-foreground">
                  Automated systems to reduce unnecessary equipment idling
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">80% Complete</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
