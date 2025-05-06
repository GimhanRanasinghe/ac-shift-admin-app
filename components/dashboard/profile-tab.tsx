import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserCertification {
  name: string
  expires: string
  status: string
}

interface UserData {
  name: string
  employeeId: string
  position: string
  certifications: UserCertification[]
}

interface ProfileTabProps {
  userData: UserData
}

export function ProfileTab({ userData }: ProfileTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Operator Profile</CardTitle>
        <CardDescription>Your personal information and certifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/profile-photo.png" alt={userData.name} />
            <AvatarFallback>
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{userData.name}</h3>
            <p className="text-sm text-muted-foreground">{userData.position}</p>
            <p className="text-sm text-muted-foreground">ID: {userData.employeeId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Certifications</h3>
          <div className="grid gap-2">
            {userData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  {cert.status === "active" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <span>{cert.name}</span>
                </div>
                <Badge variant={cert.status === "active" ? "outline" : "secondary"}>
                  Expires: {new Date(cert.expires).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
