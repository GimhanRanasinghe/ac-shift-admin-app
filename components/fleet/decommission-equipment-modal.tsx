"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DecommissionEquipmentModalProps {
  equipment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DecommissionEquipmentModal({ equipment, open, onOpenChange }: DecommissionEquipmentModalProps) {
  const [reason, setReason] = useState("")
  const [decommissionDate, setDecommissionDate] = useState("")
  const [confirmationText, setConfirmationText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!equipment) return null

  const handleSubmit = async () => {
    if (confirmationText !== equipment.id) {
      toast({
        title: "Confirmation Failed",
        description: "Please enter the correct equipment ID to confirm decommissioning.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Equipment Decommissioned",
      description: `Equipment ${equipment.id} has been successfully decommissioned.`,
    })

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Decommission Equipment
          </DialogTitle>
          <DialogDescription>
            This action will permanently decommission equipment {equipment.id} from the fleet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Decommissioning equipment removes it from active inventory. This action cannot be undone. All
                    associated sensor devices will be unlinked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decommissionDate">Decommission Date</Label>
            <Input
              id="decommissionDate"
              type="date"
              value={decommissionDate}
              onChange={(e) => setDecommissionDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Decommissioning</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="end-of-life">End of Life</SelectItem>
                <SelectItem value="damaged">Damaged Beyond Repair</SelectItem>
                <SelectItem value="obsolete">Obsolete Technology</SelectItem>
                <SelectItem value="replaced">Replaced by New Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div className="space-y-2">
              <Label htmlFor="reasonDetails">Please Specify</Label>
              <Textarea
                id="reasonDetails"
                placeholder="Enter details about the decommissioning reason"
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-red-600">
              Confirmation
            </Label>
            <p className="text-sm text-muted-foreground">
              Type <span className="font-mono font-bold">{equipment.id}</span> to confirm decommissioning
            </p>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason || !decommissionDate || confirmationText !== equipment.id}
          >
            {isSubmitting ? "Processing..." : "Decommission Equipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
