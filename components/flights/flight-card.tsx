"use client"

import { useState, useEffect } from "react"

// Custom flight icon that fits the theme better
function FlightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  )
}

// Task badge component
function TaskBadge({ task }: { task: string }) {
  const getTaskLabel = (task: string) => {
    switch (task) {
      case "loading":
        return "Loading"
      case "unloading":
        return "Unloading"
      case "pushback":
        return "Pushback"
      case "catering":
        return "Catering"
      case "fueling":
        return "Fueling"
      default:
        return "Task"
    }
  }

  return <span className={`flight-task-badge flight-task-${task}`}>{getTaskLabel(task)}</span>
}

// Progress bar component based on the provided image
function ProgressBar({ percent }: { percent: number }) {
  // Calculate how many segments to fill (out of 19 total)
  const totalSegments = 19
  const filledSegments = Math.round((percent / 100) * totalSegments)

  return (
    <div className="flex space-x-0.5 mt-1">
      {Array.from({ length: totalSegments }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-1.5 rounded-sm ${index < filledSegments ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
        />
      ))}
    </div>
  )
}

interface Flight {
  id: string
  flight: string
  origin: string
  destination: string
  scheduledDeparture: string
  actualDeparture: string
  gate: string
  terminal: string
  aircraft: string
  status: string
  task: string
  isDeparted: boolean
  progressPercent: number
  isCurrent: boolean
}

interface FlightCardProps {
  flight: Flight
}

export function FlightCard({ flight }: FlightCardProps) {
  const [timeRemaining, setTimeRemaining] = useState("")
  const [progressPercent, setProgressPercent] = useState(flight.progressPercent)
  const [endTime, setEndTime] = useState<Date | null>(null)

  // Initialize the end time for the countdown
  useEffect(() => {
    if (!flight.isCurrent || flight.isDeparted) return

    // For demo purposes, create a departure time that's less than 50 minutes away
    // We'll set it to about 27 minutes (to get ~45% completion for a 50-minute task)
    const now = new Date()
    const futureTime = new Date(now.getTime() + 27 * 60 * 1000)
    setEndTime(futureTime)
  }, [flight.isCurrent, flight.isDeparted])

  // Update time remaining and progress in real-time for current flight
  useEffect(() => {
    if (!flight.isCurrent || flight.isDeparted || !endTime) return

    const updateTimeAndProgress = () => {
      const now = new Date()
      const diffMs = endTime.getTime() - now.getTime()

      // Calculate time remaining in hh:mm:ss format
      if (diffMs <= 0) {
        setTimeRemaining("00:00:00")
        setProgressPercent(100)
      } else {
        const diffSecs = Math.floor(diffMs / 1000)
        const hrs = Math.floor(diffSecs / 3600)
        const mins = Math.floor((diffSecs % 3600) / 60)
        const secs = diffSecs % 60

        setTimeRemaining(
          `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
        )

        // Assume a standard turnaround time of 50 minutes
        const totalTaskMinutes = 50
        const elapsedMinutes = totalTaskMinutes - diffMs / 60000
        const newProgressPercent = Math.max(0, Math.min(100, (elapsedMinutes / totalTaskMinutes) * 100))
        setProgressPercent(newProgressPercent)
      }
    }

    // Update immediately
    updateTimeAndProgress()

    // Then update every second
    const interval = setInterval(updateTimeAndProgress, 1000)

    return () => clearInterval(interval)
  }, [flight.isCurrent, flight.isDeparted, endTime])

  // Calculate remaining time for non-current flights
  const getTimeRemaining = () => {
    if (flight.isDeparted) return "Departed"

    // For upcoming flights, just show the status instead of a countdown
    return flight.status
  }

  return (
    <div className={`flight-card ${flight.isDeparted ? "departed" : ""} ${flight.isCurrent ? "current" : ""}`}>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-bold text-card-foreground">{flight.flight}</span>
                <span
                  className={`ml-2 text-xs ${
                    flight.isDeparted
                      ? "text-muted-foreground"
                      : flight.status === "On Time"
                        ? "text-status-green"
                        : flight.status === "Delayed"
                          ? "text-status-red"
                          : "text-status-amber"
                  }`}
                >
                  {flight.isDeparted ? "Departed" : flight.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">To {flight.destination}</div>
            </div>
          </div>
          <FlightIcon className={`h-5 w-5 ${flight.isDeparted ? "text-muted-foreground" : "text-aircanada-red"}`} />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Time</span>
            <span className="font-medium text-card-foreground">{flight.scheduledDeparture}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Gate</span>
            <span className="font-medium text-card-foreground">{flight.gate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{flight.isCurrent ? "Time Left" : "Status"}</span>
            <span className="font-medium text-card-foreground">
              {flight.isCurrent ? timeRemaining : getTimeRemaining()}
            </span>
          </div>
        </div>

        {flight.isCurrent && !flight.isDeparted && (
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Task progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <ProgressBar percent={progressPercent} />
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <TaskBadge task={flight.task} />
          <span className="text-xs text-muted-foreground">
            {flight.isCurrent ? "In progress" : flight.isDeparted ? "Completed" : "Upcoming"}
          </span>
        </div>
      </div>
    </div>
  )
}
