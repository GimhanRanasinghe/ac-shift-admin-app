"use client"

import { useState } from "react"
import { format, addHours } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, CheckCircle } from "lucide-react"

interface CheckoutFormProps {
  activeTab: "checkout" | "reserve"
  isVerified: boolean
  handleSubmit: (action: "checkout" | "reserve") => void
  isSubmitting: boolean
}

export function CheckoutForm({ activeTab, isVerified, handleSubmit, isSubmitting }: CheckoutFormProps) {
  const [returnType, setReturnType] = useState("shift-end")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [returnTime, setReturnTime] = useState("18:00")
  const [duration, setDuration] = useState("4")

  // Calculate estimated return time based on duration
  const getEstimatedReturnTime = () => {
    if (returnType === "duration") {
      const now = new Date()
      const hours = Number.parseInt(duration)
      return format(addHours(now, hours), "h:mm a")
    }
    return format(new Date(`2023-01-01T${returnTime}`), "h:mm a")
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{activeTab === "checkout" ? "Check Out Equipment" : "Reserve Equipment"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === "reserve" && (
          <div className="space-y-2">
            <Label>Reservation Date</Label>
            <div className="border rounded-xl p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="mx-auto"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>{activeTab === "checkout" ? "Return Time" : "Pickup Time"}</Label>
          <RadioGroup value={returnType} onValueChange={setReturnType} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="shift-end"
                id="shift-end"
                className="text-aircanada-blue border-aircanada-blue data-[state=checked]:bg-aircanada-blue data-[state=checked]:text-white"
              />
              <Label htmlFor="shift-end" className="font-normal">
                End of shift
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="specific-time"
                id="specific-time"
                className="text-aircanada-blue border-aircanada-blue data-[state=checked]:bg-aircanada-blue data-[state=checked]:text-white"
              />
              <Label htmlFor="specific-time" className="font-normal">
                Specific time
              </Label>
            </div>
            {returnType === "specific-time" && (
              <div className="pl-6">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-32 rounded-xl"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="duration"
                id="duration"
                className="text-aircanada-blue border-aircanada-blue data-[state=checked]:bg-aircanada-blue data-[state=checked]:text-white"
              />
              <Label htmlFor="duration" className="font-normal">
                Duration
              </Label>
            </div>
            {returnType === "duration" && (
              <div className="pl-6">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-20 rounded-xl"
                  />
                  <span className="ml-2">hours</span>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>

        {activeTab === "checkout" && isVerified && (
          <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800">Equipment Verified</p>
              <p className="text-green-700">QR code has been scanned and verified</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-aircanada-blue hover:bg-blue-600 rounded-full"
          disabled={isSubmitting}
          onClick={() => handleSubmit(activeTab)}
        >
          {isSubmitting
            ? "Processing..."
            : activeTab === "checkout"
              ? isVerified
                ? "Check Out Equipment"
                : "Scan QR Code & Check Out"
              : "Reserve Equipment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
