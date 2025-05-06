"use client"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Clock, AlertTriangle, CheckCircle, MapPin } from "lucide-react"

// Import mock data
import checkedOutEquipment from "@/data/checked-out-equipment.json"
import equipmentHistory from "@/data/equipment-history.json"

export default function CheckedOutEquipment() {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My GSE</h1>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-aircanada-darkgray rounded-2xl">
            <TabsTrigger value="active" className="data-[state=active]:bg-aircanada-blue rounded-2xl">
              <Clock className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-aircanada-blue rounded-2xl">
              <CheckCircle className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {checkedOutEquipment.length === 0 ? (
              <div className="text-center p-8 bg-aircanada-darkgray rounded-2xl border border-aircanada-lightgray">
                <p className="text-gray-300">You don't have any equipment checked out.</p>
                <Button className="mt-4 bg-aircanada-blue hover:bg-blue-600 text-white rounded-full">
                  Search Equipment
                </Button>
              </div>
            ) : (
              checkedOutEquipment.map((equipment) => (
                <Card key={equipment.id} className="bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-white">{equipment.type}</CardTitle>
                      <Badge
                        className={`${equipment.status === "Active" ? "bg-aircanada-blue" : "bg-aircanada-red"} text-white rounded-full`}
                      >
                        {equipment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">ID</p>
                        <p className="font-medium text-white">{equipment.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Checked Out</p>
                        <p className="text-white">{equipment.checkedOutTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Return By</p>
                        <p className="text-white">{equipment.returnTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Class</p>
                        <p className="text-white">
                          <span className="equipment-class">
                            {equipment.code === "BTG" ? "A" : equipment.code === "BLW" ? "B" : "C"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-600 text-white hover:bg-gray-800 rounded-full"
                        asChild
                      >
                        <Link href="/equipment/report">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Report
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-600 text-white hover:bg-gray-800 rounded-full"
                        asChild
                      >
                        <Link href={`/equipment/search?locate=${equipment.id}`}>
                          <MapPin className="h-4 w-4 mr-2" />
                          Locate
                        </Link>
                      </Button>
                      <Button className="flex-1 bg-aircanada-blue hover:bg-blue-600 text-white rounded-full">
                        Return
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {equipmentHistory.map((equipment) => (
              <Card key={equipment.id} className="bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">{equipment.type}</CardTitle>
                    <Badge variant="outline" className="border-gray-500 text-gray-300 rounded-full">
                      Returned
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">ID</p>
                      <p className="font-medium text-white">{equipment.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Checked Out</p>
                      <p className="text-white">{equipment.checkedOutTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Returned</p>
                      <p className="text-white">{equipment.returnTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Class</p>
                      <p className="text-white">
                        <span className="equipment-class">
                          {equipment.code === "BTG" ? "A" : equipment.code === "BLW" ? "B" : "C"}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
