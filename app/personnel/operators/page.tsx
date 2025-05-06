"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Printer,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import user data
import userData from "@/data/user.json"

// Create sample operators data
const operatorsData = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: `AC${100000 + index}`,
    name: index === 0 ? userData.name : `Operator ${index + 1}`,
    position: "Ground Service Operator",
    airport: "YYZ",
    status: index % 10 === 0 ? "inactive" : "active",
    hireDate: `${2018 + Math.floor(index / 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(
      Math.floor(Math.random() * 28) + 1,
    ).padStart(2, "0")}`,
    certifications: userData.certifications.slice(0, 3 + (index % 5)).map((cert) => ({
      ...cert,
      status: index % 7 === 0 ? "expired" : index % 5 === 0 ? "warning" : "active",
    })),
    email: index === 0 ? userData.email : `operator${index + 1}@aircanada.ca`,
    phone: index === 0 ? userData.phone : `+1 (416) 555-${1000 + index}`,
  }))

export default function OperatorsManagement() {
  const [selectedOperator, setSelectedOperator] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New operator form state
  const [newOperator, setNewOperator] = useState({
    name: "",
    email: "",
    position: "Ground Service Operator",
    airport: "YYZ",
    hireDate: new Date().toISOString().split("T")[0],
    phone: "",
    status: "active",
    certifications: [] as { name: string; status: string }[],
  })

  // Filter operators based on search
  const filteredOperators = operatorsData.filter((operator) => {
    const matchesSearch =
      searchQuery === "" ||
      operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || operator.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddOperator = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new operator with the form data
      const newId = `AC${100000 + operatorsData.length}`

      // In a real app, you would add this to your database
      // For now, we'll just show a success message
      alert(
        `Operator ${newOperator.name} (${newId}) would be added to the database with ${newOperator.certifications.length} certifications and status: ${newOperator.status}.`,
      )

      // Reset form and close modal
      setNewOperator({
        name: "",
        email: "",
        position: "Ground Service Operator",
        airport: "YYZ",
        hireDate: new Date().toISOString().split("T")[0],
        phone: "",
        status: "active",
        certifications: [],
      })
      setIsSubmitting(false)
      setIsAddModalOpen(false)
    }, 1000)
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Operators Management</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FilePdf className="mr-2 h-4 w-4" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddModalOpen(true)} type="button">
              <Plus className="mr-2 h-4 w-4" />
              Add Operator
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Operators</CardTitle>
            <CardDescription>Manage ground service equipment operators and their certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search operators..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" type="button">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Only</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive Only</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon" type="button">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Airport</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperators.map((operator) => (
                      <TableRow key={operator.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={operator.id === "AC123456" ? "/profile-photo.png" : undefined}
                                alt={operator.name}
                              />
                              <AvatarFallback>
                                {operator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{operator.name}</p>
                              <p className="text-xs text-muted-foreground">{operator.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{operator.id}</TableCell>
                        <TableCell>{operator.position}</TableCell>
                        <TableCell>{operator.airport}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              operator.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {operator.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {operator.certifications.some((cert) => cert.status === "warning") && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Expiring
                              </Badge>
                            )}
                            {operator.certifications.some((cert) => cert.status === "expired") && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Expired
                              </Badge>
                            )}
                            {operator.certifications.every(
                              (cert) => cert.status !== "warning" && cert.status !== "expired",
                            ) && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Valid
                              </Badge>
                            )}
                            <Badge variant="outline">{operator.certifications.length}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(operator.hireDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" type="button">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOperator(operator)
                                  setIsViewModalOpen(true)
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOperator(operator)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOperator(operator)
                                  setIsCertModalOpen(true)
                                }}
                              >
                                Manage Certifications
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  const newStatus = operator.status === "active" ? "inactive" : "active"
                                  alert(
                                    `Operator ${operator.id} status would be updated to ${newStatus}. This would call an API in a real application.`,
                                  )
                                }}
                              >
                                {operator.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Operator Modal */}
      {selectedOperator && isViewModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Operator Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedOperator.name}
              </p>
              <p>
                <strong>ID:</strong> {selectedOperator.id}
              </p>
              <p>
                <strong>Email:</strong> {selectedOperator.email}
              </p>
              <p>
                <strong>Position:</strong> {selectedOperator.position}
              </p>
              <p>
                <strong>Airport:</strong> {selectedOperator.airport}
              </p>
              <p>
                <strong>Status:</strong> {selectedOperator.status}
              </p>
              <p>
                <strong>Hire Date:</strong> {new Date(selectedOperator.hireDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsViewModalOpen(false)} type="button">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Operator Modal */}
      {selectedOperator && isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Operator</h2>
            <p className="mb-4">
              This would be an edit form for {selectedOperator.name} (ID: {selectedOperator.id})
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Changes would be saved here")
                  setIsEditModalOpen(false)
                }}
                type="button"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Certifications Modal */}
      {selectedOperator && isCertModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Manage Certifications</h2>
            <p className="mb-4">
              Certifications for {selectedOperator.name} (ID: {selectedOperator.id})
            </p>
            <ul className="mb-4">
              {selectedOperator.certifications.map((cert: any, index: number) => (
                <li key={index} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <span>{cert.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        cert.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : cert.status === "warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {cert.status === "active" ? "Valid" : cert.status === "warning" ? "Expiring" : "Expired"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsCertModalOpen(false)} type="button">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Operator Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New Operator</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={newOperator.name}
                  onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newOperator.email}
                  onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                  placeholder="john.doe@aircanada.ca"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-300">
                    Position
                  </Label>
                  <Select
                    value={newOperator.position}
                    onValueChange={(value) => setNewOperator({ ...newOperator, position: value })}
                  >
                    <SelectTrigger id="position" className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Ground Service Operator">Ground Service Operator</SelectItem>
                      <SelectItem value="Senior Operator">Senior Operator</SelectItem>
                      <SelectItem value="Team Lead">Team Lead</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airport" className="text-gray-300">
                    Airport
                  </Label>
                  <Select
                    value={newOperator.airport}
                    onValueChange={(value) => setNewOperator({ ...newOperator, airport: value })}
                  >
                    <SelectTrigger id="airport" className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select airport" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="YYZ">Toronto (YYZ)</SelectItem>
                      <SelectItem value="YUL">Montreal (YUL)</SelectItem>
                      <SelectItem value="YVR">Vancouver (YVR)</SelectItem>
                      <SelectItem value="YYC">Calgary (YYC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate" className="text-gray-300">
                    Hire Date
                  </Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={newOperator.hireDate}
                    onChange={(e) => setNewOperator({ ...newOperator, hireDate: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newOperator.phone}
                    onChange={(e) => setNewOperator({ ...newOperator, phone: e.target.value })}
                    placeholder="+1 (416) 555-1234"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* New Status Field */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300">
                  Status
                </Label>
                <Select
                  value={newOperator.status}
                  onValueChange={(value) => setNewOperator({ ...newOperator, status: value })}
                >
                  <SelectTrigger id="status" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* New Certifications Field */}
              <div className="space-y-2">
                <Label className="text-gray-300">Certifications</Label>
                <div className="space-y-2 p-3 border border-gray-700 rounded-md">
                  {newOperator.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <span>{cert.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          cert.status === "active"
                            ? "bg-blue-900 text-blue-200 border-blue-700"
                            : "bg-red-900 text-red-200 border-red-700"
                        }
                      >
                        {cert.status === "active" ? "Valid" : "Expired"}
                      </Badge>
                    </div>
                  ))}

                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        const certName = prompt("Enter certification name")
                        if (certName) {
                          setNewOperator({
                            ...newOperator,
                            certifications: [...newOperator.certifications, { name: certName, status: "active" }],
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Valid Certification
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        const certName = prompt("Enter certification name")
                        if (certName) {
                          setNewOperator({
                            ...newOperator,
                            certifications: [...newOperator.certifications, { name: certName, status: "expired" }],
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Expired Certification
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                type="button"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddOperator}
                disabled={!newOperator.name || !newOperator.email || isSubmitting}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Adding..." : "Add Operator"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DesktopLayout>
  )
}
