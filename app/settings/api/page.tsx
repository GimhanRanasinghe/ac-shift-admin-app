"use client"

import { DesktopLayout } from "@/components/desktop-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiSettings } from "@/components/settings/api-settings"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApiSettingsPage() {
  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/settings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">API Configuration</h1>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <ApiSettings />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>API Status</CardTitle>
                <CardDescription>Current status of API connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Main API</div>
                      <div className="mt-1 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm text-muted-foreground">Operational</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Authentication Service</div>
                      <div className="mt-1 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm text-muted-foreground">Operational</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Reporting Service</div>
                      <div className="mt-1 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="text-sm text-muted-foreground">Degraded Performance</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Notification Service</div>
                      <div className="mt-1 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm text-muted-foreground">Operational</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Configure and test API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will allow you to configure and test specific API endpoints.
                  Feature coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>API Authentication</CardTitle>
                <CardDescription>Configure API authentication settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will allow you to configure API authentication settings.
                  Feature coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>API Logs</CardTitle>
                <CardDescription>View API request logs and errors</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will display API request logs and errors.
                  Feature coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopLayout>
  )
}
