"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, PenToolIcon as Tool } from "lucide-react"

interface MaintenanceHistoryModalProps {
  equipment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample maintenance history data
const maintenanceHistory = [
  {
    id: "MH-001",
    date: "2023-12-15",
    type: "Preventive",
    description: "Regular 3-month maintenance check",
    technician: "John Smith",
    status: "Completed",
    parts: ["Oil filter", "Air filter"],
    cost: "$450.00",
  },
  {
    id: "MH-002",
    date: "2023-09-22",
    type: "Corrective",
    description: "Hydraulic system repair",
    technician: "Maria Rodriguez",
    status: "Completed",
    parts: ["Hydraulic pump", "Pressure valve"],
    cost: "$1,250.00",
  },
  {
    id: "MH-003",
    date: "2023-06-10",
    type: "Preventive",
    description: "Regular 6-month maintenance check",
    technician: "John Smith",
    status: "Completed",
    parts: ["Oil filter", "Fuel filter", "Brake pads"],
    cost: "$680.00",
  },
  {
    id: "MH-004",
    date: "2023-03-05",
    type: "Corrective",
    description: "Electrical system troubleshooting",
    technician: "Alex Johnson",
    status: "Completed",
    parts: ["Battery", "Wiring harness"],
    cost: "$520.00",
  },
  {
    id: "MH-005",
    date: "2022-12-18",
    type: "Preventive",
    description: "Annual maintenance check",
    technician: "Maria Rodriguez",
    status: "Completed",
    parts: ["Complete service kit"],
    cost: "$950.00",
  },
]

export function MaintenanceHistoryModal({ equipment, open, onOpenChange }: MaintenanceHistoryModalProps) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tool className="h-5 w-5" />
            Maintenance History - {equipment.id}
          </DialogTitle>
          <DialogDescription>
            Complete maintenance records for {equipment.type} ({equipment.category})
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Next scheduled: {equipment.nextMaintenance}</span>
            </div>
          </div>
          <Button size="sm">
            <Tool className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        record.type === "Preventive"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.technician}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Export Records
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
