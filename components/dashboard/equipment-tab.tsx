import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CheckCircle, AlertCircle } from "lucide-react"

interface EquipmentItem {
  id: string
  type: string
  category: string
  code: string
  checkedOutTime: string
  returnTime: string
  status: string
}

interface EquipmentTabProps {
  checkedOutEquipment: EquipmentItem[]
  equipmentHistory: EquipmentItem[]
}

export function EquipmentTab({ checkedOutEquipment, equipmentHistory }: EquipmentTabProps) {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Equipment Search</CardTitle>
          <CardDescription>Find and check out ground service equipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
            <Link href="/equipment/search">
              <Search className="mr-2 h-4 w-4" />
              Search Equipment
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <Link href="/equipment/checked-out">
                <CheckCircle className="mr-2 h-4 w-4" />
                My Equipment
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/equipment/report">
                <AlertCircle className="mr-2 h-4 w-4" />
                Report Issue
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent equipment usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkedOutEquipment.length > 0 && (
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">
                    {checkedOutEquipment[0].type} ({checkedOutEquipment[0].id})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Checked out today at {checkedOutEquipment[0].checkedOutTime}
                  </p>
                </div>
                <Badge>Active</Badge>
              </div>
            )}

            {equipmentHistory.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className={
                  index < equipmentHistory.length - 1
                    ? "flex items-center justify-between border-b pb-2"
                    : "flex items-center justify-between"
                }
              >
                <div>
                  <p className="font-medium">
                    {item.type} ({item.id})
                  </p>
                  <p className="text-sm text-muted-foreground">Returned {item.returnTime}</p>
                </div>
                <Badge variant="outline">Returned</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
