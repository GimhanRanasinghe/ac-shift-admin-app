"use client"

import { AppLayout } from "@/components/app-layout"
import { ApiExample } from "@/components/examples/api-example"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api-config"

export default function ApiIntegrationExample() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Integration</h1>
          <p className="text-muted-foreground">
            Examples of how to use the API client to interact with the backend.
          </p>
        </div>

        <Tabs defaultValue="example">
          <TabsList>
            <TabsTrigger value="example">Example</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="example" className="space-y-4">
            <ApiExample />
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  The API configuration is centralized in the lib/api-config.ts file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Base URL</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The base URL is set using the NEXT_PUBLIC_API_BASE_URL environment variable.
                  </p>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {API_BASE_URL}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Endpoints</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Endpoints are defined in the API_ENDPOINTS object.
                  </p>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm overflow-auto max-h-60">
                    <pre>{JSON.stringify(API_ENDPOINTS, null, 2)}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guide</CardTitle>
                <CardDescription>
                  How to use the API client in your components.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">1. Import the service</h3>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {`import { EquipmentService } from '@/lib/services/equipment-service';`}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">2. Call the service methods</h3>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {`// Get all equipment\ntry {\n  const equipment = await EquipmentService.getAllEquipment();\n  console.log('Equipment:', equipment);\n} catch (error) {\n  console.error('Error:', error);\n}`}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">3. Handle the response</h3>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {`// Example with React state\nconst [data, setData] = useState([]);\nconst [loading, setLoading] = useState(false);\nconst [error, setError] = useState(null);\n\nconst fetchData = async () => {\n  setLoading(true);\n  try {\n    const result = await EquipmentService.getAllEquipment();\n    setData(result);\n  } catch (err) {\n    setError(err);\n  } finally {\n    setLoading(false);\n  }\n};`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
