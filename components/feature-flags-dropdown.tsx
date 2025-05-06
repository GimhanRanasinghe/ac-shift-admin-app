"use client"

import { useFeatureFlags } from "@/context/feature-flags-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Settings, Flag } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FeatureFlagsSettings } from "./feature-flags-settings"

export function FeatureFlagsDropdown() {
  const { featureFlags, toggleFeatureFlag } = useFeatureFlags()
  const [showFullSettings, setShowFullSettings] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Flag className="h-5 w-5" />
            <span className="sr-only">Feature Flags</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Feature Flags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Add Equipment</span>
                <Switch
                  checked={featureFlags.addEquipment}
                  onCheckedChange={() => toggleFeatureFlag("addEquipment")}
                  size="sm"
                />
              </div>
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Edit Equipment</span>
                <Switch
                  checked={featureFlags.editEquipment}
                  onCheckedChange={() => toggleFeatureFlag("editEquipment")}
                  size="sm"
                />
              </div>
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Export Data</span>
                <Switch
                  checked={featureFlags.exportData}
                  onCheckedChange={() => toggleFeatureFlag("exportData")}
                  size="sm"
                />
              </div>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowFullSettings(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>All Feature Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showFullSettings} onOpenChange={setShowFullSettings}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Feature Flag Settings</DialogTitle>
            <DialogDescription>
              Enable or disable specific features in the application. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <FeatureFlagsSettings />
        </DialogContent>
      </Dialog>
    </>
  )
}
