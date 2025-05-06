"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addHours } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { QRScanner } from "@/components/qr-scanner"
import { EquipmentDetails } from "@/components/equipment-checkout/equipment-details"
import { CheckoutForm } from "@/components/equipment-checkout/checkout-form"
import { CertificationRequired } from "@/components/equipment-checkout/certification-required"
import { CheckoutConfirmation } from "@/components/equipment-checkout/checkout-confirmation"

// Import data
import userData from "@/data/user.json"
import equipmentData from "@/data/equipment.json"

export default function EquipmentCheckout({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"checkout" | "reserve">("checkout")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  // Extract user certifications
  const userCertifications = userData.certifications.map((cert) => cert.name)

  // Find the equipment by ID
  const equipment = equipmentData.find((item) => item.id === params.id) || equipmentData[0]

  // Check if user has the required certification
  const hasCertification = (certificationRequired: string) => {
    return userCertifications.includes(certificationRequired)
  }

  const isCertified = hasCertification(equipment.certificationRequired)

  // Calculate estimated return time based on duration
  const getEstimatedReturnTime = () => {
    // This is a placeholder - the actual calculation is in the CheckoutForm component
    return format(addHours(new Date(), 4), "h:mm a")
  }

  const handleQRScan = (data: string) => {
    // Verify that the scanned QR code matches the equipment ID
    if (data === params.id) {
      setIsVerified(true)
    } else {
      // In a real app, you would show an error message
      console.error("QR code does not match equipment ID")
      // For demo purposes, we'll still set it as verified
      setIsVerified(true)
    }
    setShowQRScanner(false)
  }

  const handleSubmit = (action: "checkout" | "reserve") => {
    if (!isVerified && action === "checkout") {
      setShowQRScanner(true)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(true)
    }, 1000)
  }

  const handleBack = () => {
    router.back()
  }

  if (showConfirmation) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 max-w-md">
          <CheckoutConfirmation
            activeTab={activeTab}
            equipmentId={params.id}
            equipmentType={equipment.type}
            selectedDate={selectedDate}
            estimatedReturnTime={getEstimatedReturnTime()}
          />
        </div>
      </AppLayout>
    )
  }

  // If not certified, show certification required message
  if (!isCertified) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 max-w-md">
          <Button variant="ghost" onClick={handleBack} className="mb-4 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>

          <CertificationRequired certificationRequired={equipment.certificationRequired} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <EquipmentDetails equipment={equipment} />
          </div>

          <div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "checkout" | "reserve")}>
              <TabsList className="grid grid-cols-2 mb-4 rounded-2xl">
                <TabsTrigger value="checkout" className="rounded-2xl">
                  Check Out Now
                </TabsTrigger>
                <TabsTrigger value="reserve" className="rounded-2xl">
                  Reserve for Later
                </TabsTrigger>
              </TabsList>

              <CheckoutForm
                activeTab={activeTab}
                isVerified={isVerified}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </Tabs>
          </div>
        </div>
      </div>

      {showQRScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowQRScanner(false)} />}
    </AppLayout>
  )
}
