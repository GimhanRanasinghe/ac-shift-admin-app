"use client"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { PersonalInfoCard } from "@/components/profile/personal-info-card"
import { CertificationsCard } from "@/components/profile/certifications-card"
import { useState, useEffect } from "react"

// Import user data
import userData from "@/data/user.json"

export default function Profile() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Mark component as loaded after initial render
    setIsLoaded(true)
  }, [])

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800 rounded-full">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <PersonalInfoCard userData={userData} />
          </div>

          <div className="md:col-span-2">
            {isLoaded && <CertificationsCard certifications={userData.certifications || []} />}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
