"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MaintenanceTask {
  id: string
  equipmentId: string
  equipmentType: string
  maintenanceType: string
  dueDate: string
  status: string
  assignedTo: string
  priority: string
}

interface MaintenanceCalendarViewProps {
  maintenanceData: MaintenanceTask[]
}

export function MaintenanceCalendarView({ maintenanceData }: MaintenanceCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1)

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      })
    }

    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
        date,
      })
    }

    // Next month days
    const totalDaysNeeded = 42 // 6 rows of 7 days
    const remainingDays = totalDaysNeeded - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(currentYear, currentMonth + 1, i),
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Get maintenance tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return maintenanceData.filter((task) => task.dueDate === dateString)
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentMonth(new Date().getMonth())
              setCurrentYear(new Date().getFullYear())
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const tasks = getTasksForDate(day.date)
          return (
            <Card
              key={index}
              className={`min-h-[100px] p-2 ${
                day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
              } ${day.isToday ? "border-2 border-blue-500" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${day.isToday ? "text-blue-500" : ""}`}>{day.day}</span>
                {tasks.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {tasks.length}
                  </Badge>
                )}
              </div>
              <div className="mt-1 space-y-1">
                {tasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded truncate ${
                      task.status === "overdue"
                        ? "bg-red-50 text-red-700"
                        : task.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {task.equipmentId}
                  </div>
                ))}
                {tasks.length > 2 && <div className="text-xs text-gray-500 p-1">+{tasks.length - 2} more</div>}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
