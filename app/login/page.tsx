"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AirCanadaLogo } from "@/components/air-canada-logo"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState("admin@aircanada.ca")
  const [password, setPassword] = useState("password")
  const [role, setRole] = useState("admin")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Call the login function from our auth hook
      await login({ email, password });
      // The hook will handle the redirect to dashboard
    } catch (err) {
      // Error is handled by the hook and displayed below
      console.error('Login failed:', err);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4 flex flex-col items-center">
            <AirCanadaLogo className="h-12 w-auto" />
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">GSE Portal</CardTitle>
              <CardDescription>Administration & Management</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="forecaster">Forecaster</SelectItem>
                    <SelectItem value="hr">HR Manager</SelectItem>
                    <SelectItem value="planner">Resource Planner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-aircanada-red hover:bg-red-700 text-white" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">Air Canada Ground Support Equipment Management Portal</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
