"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface CheckoutConfirmationProps {
  activeTab: "checkout" | "reserve"
  equipmentId: string
  equipmentType: string
  selectedDate: Date | undefined
  estimatedReturnTime: string
}

export function CheckoutConfirmation({
  activeTab,
  equipmentId,
  equipmentType,
  selectedDate,
  estimatedReturnTime,
}: CheckoutConfirmationProps) {
  const router = useRouter()
  const confirmationNumber = `GSE-${Math.floor(Math.random() * 10000)}`

  return (
    <Card className="border-green-100 rounded-2xl">
      <CardHeader className="pb-2 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
        <CardTitle className="text-xl">
          {activeTab === "checkout" ? "Equipment Checked Out" : "Equipment Reserved"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Equipment:</span>
            <span className="font-medium">{equipmentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-medium">{equipmentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{activeTab === "checkout" ? "Return By:" : "Reserved For:"}</span>
            <span className="font-medium">
              {format(selectedDate || new Date(), "MMM d, yyyy")} at {estimatedReturnTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Confirmation #:</span>
            <span className="font-medium">{confirmationNumber}</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {activeTab === "checkout" ? (
            <p>
              You have successfully checked out this equipment. Please return it by the specified time or extend your
              checkout if needed.
            </p>
          ) : (
            <p>
              Your reservation is confirmed. The equipment will be available for pickup at the specified time and
              location.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full bg-aircanada-blue hover:bg-blue-600 rounded-full"
          onClick={() => router.push("/equipment/search")}
        >
          Return to Search
        </Button>
        <Button variant="outline" className="w-full rounded-full" onClick={() => router.push("/equipment/checked-out")}>
          View My Equipment
        </Button>
      </CardFooter>
    </Card>
  )
}
