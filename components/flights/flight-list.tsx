import { FlightCard } from "./flight-card"

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

interface FlightListProps {
  flights: Flight[]
}

export function FlightList({ flights }: FlightListProps) {
  if (flights.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg border border-border">
        <p className="text-muted-foreground">No flights found.</p>
      </div>
    )
  }

  // Sort flights by scheduled departure time
  const sortedFlights = [...flights].sort((a, b) => {
    // Convert time strings to comparable values
    const timeA = a.scheduledDeparture.split(":").map(Number)
    const timeB = b.scheduledDeparture.split(":").map(Number)

    // Compare hours first
    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0]

    // If hours are the same, compare minutes
    return timeA[1] - timeB[1]
  })

  // Find the current flight for timeline indicator
  const currentFlightIndex = sortedFlights.findIndex((flight) => flight.isCurrent)

  // Calculate the position of the "now" indicator as a percentage
  const calculateNowPosition = () => {
    if (sortedFlights.length === 0) return 50

    // If we have a current flight, position based on its progress
    if (currentFlightIndex >= 0) {
      // Position the "now" indicator between the last departed flight and the current flight
      // This ensures it's clear that we're currently working on the "In Progress" flight
      const segmentSize = 100 / sortedFlights.length
      const basePosition = currentFlightIndex * segmentSize + segmentSize * 0.5

      return basePosition
    }

    // If all flights are in the past, position at the bottom
    const allDeparted = sortedFlights.every((flight) => flight.isDeparted)
    if (allDeparted) return 100

    // If all flights are in the future, position at the top
    const allFuture = sortedFlights.every((flight) => !flight.isDeparted)
    if (allFuture) return 0

    // Default to middle
    return 50
  }

  const nowPosition = calculateNowPosition()

  // Generate time labels for the timeline
  const generateTimeLabels = () => {
    if (sortedFlights.length === 0) return []

    // Get earliest and latest times
    const earliestTime = sortedFlights[0].scheduledDeparture
    const latestTime = sortedFlights[sortedFlights.length - 1].scheduledDeparture

    // Create a set of unique hours from the flights
    const hours = new Set<number>()
    sortedFlights.forEach((flight) => {
      const hour = Number.parseInt(flight.scheduledDeparture.split(":")[0])
      hours.add(hour)
    })

    // Add the hour before the earliest and after the latest for context
    const earliestHour = Number.parseInt(earliestTime.split(":")[0])
    const latestHour = Number.parseInt(latestTime.split(":")[0])
    if (earliestHour > 0) hours.add(earliestHour - 1)
    if (latestHour < 23) hours.add(latestHour + 1)

    // Convert to array and sort
    return Array.from(hours)
      .sort((a, b) => a - b)
      .map((hour) => ({
        hour,
        label: `${hour}:00`,
        position: calculateHourPosition(hour, earliestHour - 1, latestHour + 1),
      }))
  }

  // Calculate position for an hour on the timeline
  const calculateHourPosition = (hour: number, earliest: number, latest: number) => {
    const range = latest - earliest
    if (range === 0) return 50
    return ((hour - earliest) / range) * 100
  }

  const timeLabels = generateTimeLabels()

  return (
    <div className="relative">
      {/* Timeline with time scales */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted z-10">
        {/* Time labels - rotated 90 degrees */}
        {timeLabels.map((timeLabel, index) => (
          <div
            key={index}
            className="absolute -left-6 transform -translate-y-1/2 flex items-center"
            style={{ top: `${timeLabel.position}%` }}
          >
            <div
              className="text-xs text-muted-foreground transform -rotate-90 origin-center whitespace-nowrap"
              style={{ marginLeft: "-12px", marginBottom: "16px" }}
            >
              {timeLabel.label}
            </div>
            <div className="w-3 h-0.5 bg-muted-foreground ml-1"></div>
          </div>
        ))}

        {/* "Now" indicator - subtle triangle pointer */}
        <div
          className="absolute w-0 h-0 -left-1 z-20 border-solid"
          style={{
            top: `${nowPosition}%`,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "6px solid #E31837", // aircanada-red
          }}
        ></div>
      </div>

      <div className="space-y-2 ml-8">
        {sortedFlights.map((flight, index) => (
          <div key={flight.id} className="relative">
            <FlightCard flight={flight} />
          </div>
        ))}
      </div>
    </div>
  )
}
