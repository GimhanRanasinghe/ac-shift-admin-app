"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ChevronLeft, ChevronRight, Download, Filter, Printer } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function DailySchedule() {
  const [date, setDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Sample schedule data
  const scheduleData = [
    {
      time: "06:00",
      flights: 5,
      equipmentNeeded: 12,
      staffNeeded: 18,
      status: "completed",
    },
    {
      time: "07:00",
      flights: 8,
      equipmentNeeded: 20,
      staffNeeded: 25,
      status: "completed",
    },
    {
      time: "08:00",
      flights: 12,
      equipmentNeeded: 28,
      staffNeeded: 32,
      status: "in-progress",
    },
    {
      time: "09:00",
      flights: 10,
      equipmentNeeded: 24,
      staffNeeded: 30,
      status: "upcoming",
    },
    {
      time: "10:00",
      flights: 7,
      equipmentNeeded: 18,
      staffNeeded: 22,
      status: "upcoming",
    },
    {
      time: "11:00",
      flights: 9,
      equipmentNeeded: 22,
      staffNeeded: 28,
      status: "upcoming",
    },
    {
      time: "12:00",
      flights: 11,
      equipmentNeeded: 26,
      staffNeeded: 34,
      status: "upcoming",
    },
    {
      time: "13:00",
      flights: 8,
      equipmentNeeded: 20,
      staffNeeded: 26,
      status: "upcoming",
    },
    {
      time: "14:00",
      flights: 6,
      equipmentNeeded: 16,
      staffNeeded: 20,
      status: "upcoming",
    },
    {
      time: "15:00",
      flights: 9,
      equipmentNeeded: 22,
      staffNeeded: 28,
      status: "upcoming",
    },
    {
      time: "16:00",
      flights: 14,
      equipmentNeeded: 32,
      staffNeeded: 38,
      status: "upcoming",
    },
    {
      time: "17:00",
      flights: 12,
      equipmentNeeded: 28,
      staffNeeded: 34,
      status: "upcoming",
    },
    {
      time: "18:00",
      flights: 10,
      equipmentNeeded: 24,
      staffNeeded: 30,
      status: "upcoming",
    },
    {
      time: "19:00",
      flights: 7,
      equipmentNeeded: 18,
      staffNeeded: 22,
      status: "upcoming",
    },
    {
      time: "20:00",
      flights: 5,
      equipmentNeeded: 14,
      staffNeeded: 18,
      status: "upcoming",
    },
    {
      time: "21:00",
      flights: 4,
      equipmentNeeded: 10,
      staffNeeded: 14,
      status: "upcoming",
    },
    {
      time: "22:00",
      flights: 3,
      equipmentNeeded: 8,
      staffNeeded: 12,
      status: "upcoming",
    },
  ]

  const previousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    setDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    setDate(newDate)
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Daily Schedule</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate)
                      setCalendarOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Badge variant="outline" className="text-sm">
              YYZ - Toronto Pearson International Airport
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule for {format(date, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>Hourly breakdown of flights, equipment, and staff requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Time</th>
                    <th className="p-2 text-left font-medium">Flights</th>
                    <th className="p-2 text-left font-medium">Equipment Needed</th>
                    <th className="p-2 text-left font-medium">Staff Needed</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-2 font-medium">{item.time}</td>
                      <td className="p-2">{item.flights}</td>
                      <td className="p-2">{item.equipmentNeeded}</td>
                      <td className="p-2">{item.staffNeeded}</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : item.status === "in-progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {item.status === "completed"
                            ? "Completed"
                            : item.status === "in-progress"
                              ? "In Progress"
                              : "Upcoming"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  )
}
