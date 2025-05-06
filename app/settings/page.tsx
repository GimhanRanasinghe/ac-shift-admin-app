"use client"

import { DesktopLayout } from "@/components/desktop-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, SettingsIcon, Bell, Globe } from "lucide-react"
import { FeatureFlagsSettings } from "@/components/feature-flags-settings"
import { ApiSettings } from "@/components/settings/api-settings"

export default function Settings() {
  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        {/* API Settings Section */}
        <ApiSettings />

        {/* Feature Flags Section */}
        <FeatureFlagsSettings />

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system-wide settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <a href="/settings/users">
                  <Users className="h-8 w-8 mb-2" />
                  <span>User Management</span>
                </a>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <a href="/settings/system">
                  <SettingsIcon className="h-8 w-8 mb-2" />
                  <span>System Configuration</span>
                </a>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <a href="/settings/notifications">
                  <Bell className="h-8 w-8 mb-2" />
                  <span>Notifications</span>
                </a>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                <a href="/settings/api">
                  <Globe className="h-8 w-8 mb-2" />
                  <span>API Configuration</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Details about the current system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">May 10, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Status</span>
                  <span className="font-medium">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>Details about your license</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License Type</span>
                  <span className="font-medium">Enterprise</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued To</span>
                  <span className="font-medium">Air Canada</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued Date</span>
                  <span className="font-medium">January 1, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration Date</span>
                  <span className="font-medium">December 31, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users Allowed</span>
                  <span className="font-medium">Unlimited</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesktopLayout>
  )
}
