import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AirCanadaLogo } from "@/components/air-canada-logo"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4 flex flex-col items-center">
            <AirCanadaLogo className="h-16 w-auto" />
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">GSE Portal</CardTitle>
              <CardDescription>Administration & Management</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Welcome to the Air Canada Ground Support Equipment Management Portal. Please sign in to continue.
            </p>
            <Link href="/login" className="w-full block">
              <Button className="w-full bg-aircanada-red hover:bg-red-700 text-white">Sign in</Button>
            </Link>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Air Canada Ground Operations</p>
              <p>Version 2.0.0</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
