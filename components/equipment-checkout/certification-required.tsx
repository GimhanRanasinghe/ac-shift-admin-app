"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface CertificationRequiredProps {
  certificationRequired: string
}

export function CertificationRequired({ certificationRequired }: CertificationRequiredProps) {
  const router = useRouter()

  return (
    <Card className="border-amber-100 rounded-2xl">
      <CardHeader className="pb-2 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-2" />
        <CardTitle className="text-xl">Certification Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 p-4 rounded-xl space-y-2">
          <p className="text-center text-amber-800">You need the following certification to use this equipment:</p>
          <p className="text-center font-medium text-amber-900">{certificationRequired}</p>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Please contact your supervisor or training department to obtain the required certification.</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full bg-aircanada-blue hover:bg-blue-600 rounded-full"
          onClick={() => router.push("/equipment/search")}
        >
          Return to Search
        </Button>
        <Button variant="outline" className="w-full rounded-full" onClick={() => router.push("/profile")}>
          View My Certifications
        </Button>
      </CardFooter>
    </Card>
  )
}
