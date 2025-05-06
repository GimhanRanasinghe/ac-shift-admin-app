"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Camera, CheckCircle } from "lucide-react"

export default function ReportIssue() {
  const [equipmentId, setEquipmentId] = useState("")
  const [issueType, setIssueType] = useState("minor")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the report to an API
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 space-y-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <CardTitle>Report Submitted</CardTitle>
                <CardDescription>
                  Your issue report for equipment {equipmentId} has been submitted successfully.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-center">
                <p>A maintenance team will review your report and take appropriate action.</p>
                <p className="text-sm text-muted-foreground">Report ID: REP-{Math.floor(Math.random() * 10000)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" onClick={() => setSubmitted(false)}>
                  Report Another Issue
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Report Equipment Issue</h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Equipment Issue Report</CardTitle>
            <CardDescription>Report any issues with ground service equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="equipmentId">Equipment ID</Label>
                <Input
                  id="equipmentId"
                  placeholder="Enter equipment ID (e.g., BTG-1045)"
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Issue Severity</Label>
                <RadioGroup value={issueType} onValueChange={setIssueType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minor" id="minor" />
                    <Label htmlFor="minor" className="font-normal">
                      Minor Issue (Equipment still usable)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="major" id="major" />
                    <Label htmlFor="major" className="font-normal">
                      Major Issue (Limited functionality)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="font-normal">
                      Critical Issue (Equipment unusable)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Issue Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <Button type="button" variant="outline" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleSubmit}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
