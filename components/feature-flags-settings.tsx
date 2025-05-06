"use client"

import { useFeatureFlags } from "@/context/feature-flags-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RefreshCw } from "lucide-react"

export function FeatureFlagsSettings() {
  const { featureFlags, toggleFeatureFlag, resetFeatureFlags } = useFeatureFlags()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>Enable or disable specific features in the application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Fleet Management</h3>
            <Separator className="my-2" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="add-equipment">Add Equipment</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the "Add Equipment" button in the Fleet Inventory section
                  </p>
                </div>
                <Switch
                  id="add-equipment"
                  checked={featureFlags.addEquipment}
                  onCheckedChange={() => toggleFeatureFlag("addEquipment")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-equipment">Edit Equipment</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the ability to edit equipment details
                  </p>
                </div>
                <Switch
                  id="edit-equipment"
                  checked={featureFlags.editEquipment}
                  onCheckedChange={() => toggleFeatureFlag("editEquipment")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="decommission-equipment">Decommission Equipment</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the ability to decommission equipment
                  </p>
                </div>
                <Switch
                  id="decommission-equipment"
                  checked={featureFlags.decommissionEquipment}
                  onCheckedChange={() => toggleFeatureFlag("decommissionEquipment")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-history">Maintenance History</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable access to equipment maintenance history
                  </p>
                </div>
                <Switch
                  id="maintenance-history"
                  checked={featureFlags.maintenanceHistory}
                  onCheckedChange={() => toggleFeatureFlag("maintenanceHistory")}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">UI Features</h3>
            <Separator className="my-2" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="date-range-filter">Date Range Filter</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable date range filtering in inventory views
                  </p>
                </div>
                <Switch
                  id="date-range-filter"
                  checked={featureFlags.dateRangeFilter}
                  onCheckedChange={() => toggleFeatureFlag("dateRangeFilter")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="advanced-filters">Advanced Filters</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable advanced filtering options</p>
                </div>
                <Switch
                  id="advanced-filters"
                  checked={featureFlags.advancedFilters}
                  onCheckedChange={() => toggleFeatureFlag("advancedFilters")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="export-data">Export Data</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable data export functionality</p>
                </div>
                <Switch
                  id="export-data"
                  checked={featureFlags.exportData}
                  onCheckedChange={() => toggleFeatureFlag("exportData")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="map-view">Map View</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable map visualization features</p>
                </div>
                <Switch
                  id="map-view"
                  checked={featureFlags.mapView}
                  onCheckedChange={() => toggleFeatureFlag("mapView")}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetFeatureFlags}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </CardFooter>
    </Card>
  )
}
