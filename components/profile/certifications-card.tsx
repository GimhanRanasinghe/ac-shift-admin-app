"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Award } from "lucide-react"
import { useState } from "react"

interface Certification {
  name: string
  expires: string
  status: string
}

interface CertificationsCardProps {
  certifications: Certification[]
}

export function CertificationsCard({ certifications = [] }: CertificationsCardProps) {
  const [isError, setIsError] = useState(false)

  if (!Array.isArray(certifications)) {
    return (
      <Card className="h-full bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Certifications</CardTitle>
          <CardDescription className="text-gray-400">Your equipment operation certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-gray-400">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-500" />
            <p>No certification data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Certifications</CardTitle>
        <CardDescription className="text-gray-400">Your equipment operation certifications</CardDescription>
      </CardHeader>
      <CardContent>
        {certifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-500" />
            <p>No certifications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert, index) => {
              // Safely handle potentially malformed data
              const name = cert?.name || "Unknown Certification"
              const expires = cert?.expires || "Unknown"
              const status = cert?.status || "unknown"

              let expiryDate = "Unknown"
              try {
                expiryDate = new Date(expires).toLocaleDateString()
              } catch (e) {
                // If date parsing fails, use the raw string
                expiryDate = expires
              }

              return (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    {status === "active" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium text-white">{name}</p>
                      <p className="text-sm text-gray-400">Expires: {expiryDate}</p>
                    </div>
                  </div>
                  <Badge
                    variant={status === "active" ? "outline" : "secondary"}
                    className={
                      status === "active"
                        ? "border-green-500 text-green-500 rounded-full"
                        : "bg-amber-500 text-black rounded-full"
                    }
                  >
                    {status === "active" ? "Valid" : "Renew Soon"}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
