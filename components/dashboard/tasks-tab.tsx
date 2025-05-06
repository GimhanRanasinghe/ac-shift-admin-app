import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, MapPin } from "lucide-react"

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
  date: string
}

interface TasksTabProps {
  flightAssignments: Flight[]
}

export function TasksTab({ flightAssignments }: TasksTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Flight Assignments</CardTitle>
        <CardDescription>Your assigned flights for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {flightAssignments.map((flight) => (
            <div key={flight.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-red-600" />
                  <span className="font-medium">{flight.flight}</span>
                </div>
                <Badge
                  variant={
                    flight.status === "On Time" ? "outline" : flight.status === "Delayed" ? "destructive" : "secondary"
                  }
                >
                  {flight.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Origin</p>
                  <p>{flight.origin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Destination</p>
                  <p>{flight.destination}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Scheduled</p>
                  <p>{flight.scheduledDeparture}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Actual</p>
                  <p>{flight.actualDeparture}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Gate {flight.gate}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
