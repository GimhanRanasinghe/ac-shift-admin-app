"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

// Import the equipment service
import { EquipmentService } from "@/lib/services/equipment-service"
import { API_BASE_URL } from "@/lib/api-config"

// Equipment type
interface Equipment {
  id: string
  type: string
  category: string
  status: string
  // Add other properties as needed
}

export function ApiExample() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Function to fetch equipment
  const fetchEquipment = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const data = await EquipmentService.getAllEquipment()
      setEquipment(data)
      setSuccess("Successfully fetched equipment data")
    } catch (err) {
      setError("Failed to fetch equipment. Please check your API configuration.")
      console.error("Error fetching equipment:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration Example</CardTitle>
        <CardDescription>
          This example demonstrates how to use the API client to fetch data from the backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-mono break-all">
            Current API Base URL: {API_BASE_URL}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You can change this by setting the NEXT_PUBLIC_API_BASE_URL environment variable.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <Button onClick={fetchEquipment} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Fetch Equipment"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {equipment.length > 0 ? `${equipment.length} items found` : "No data"}
          </p>
        </div>

        {equipment.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 text-sm">{item.id}</td>
                    <td className="px-4 py-2 text-sm">{item.type}</td>
                    <td className="px-4 py-2 text-sm">{item.category}</td>
                    <td className="px-4 py-2 text-sm">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
