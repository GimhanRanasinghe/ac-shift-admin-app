import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserData {
  name: string
  employeeId: string
  position: string
  email: string
  phone: string
  startDate: string
  airport: string
}

interface PersonalInfoCardProps {
  userData: UserData
}

export function PersonalInfoCard({ userData }: PersonalInfoCardProps) {
  return (
    <Card className="bg-aircanada-cardgray border-aircanada-lightgray rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/profile-photo.png" alt={userData.name} />
            <AvatarFallback className="bg-aircanada-lightgray text-white">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="font-medium text-lg text-white">{userData.name}</h3>
            <p className="text-sm text-gray-400">{userData.position}</p>
            <Badge variant="outline" className="mt-2 bg-red-50 text-red-600 border-red-200 rounded-full">
              {userData.airport}
            </Badge>
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Employee ID</p>
              <p className="text-white">{userData.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">{userData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-white">{new Date(userData.startDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
