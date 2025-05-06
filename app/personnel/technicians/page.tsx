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
  Wrench,
  PenToolIcon as Tool,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import user data
import userData from "@/data/user.json"

// Create sample technicians data
const techniciansData = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: `TC${100000 + index}`,
    name: index === 0 ? `${userData.name.split(" ")[0]} Smith` : `Technician ${index + 1}`,
    position: ["Maintenance Technician", "Senior Technician", "Lead Technician", "Specialist"][index % 4],
    specialty: ["Mechanical", "Electrical", "Hydraulic", "Avionics", "General"][index % 5],
    airport: "YYZ",
    status: index % 10 === 0 ? "inactive" : "active",
    hireDate: `${2018 + Math.floor(index / 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(
      Math.floor(Math.random() * 28) + 1,
    ).padStart(2, "0")}`,
    certifications: userData.certifications.slice(0, 2 + (index % 4)).map((cert) => ({
      ...cert,
      status: index % 7 === 0 ? "expired" : index % 5 === 0 ? "warning" : "active",
    })),
    email: index === 0 ? `${userData.email.split("@")[0]}.smith@aircanada.ca` : `technician${index + 1}@aircanada.ca`,
    phone: index === 0 ? userData.phone : `+1 (416) 555-${2000 + index}`,
  }))

export default function TechniciansManagement() {
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New technician form state
  const [newTechnician, setNewTechnician] = useState({
    name: "",
    email: "",
    position: "Maintenance Technician",
    specialty: "General",
    airport: "YYZ",
    hireDate: new Date().toISOString().split("T")[0],
    phone: "",
    status: "active",
    certifications: [] as { name: string; status: string }[],
  })

  // Filter technicians based on search and filters
  const filteredTechnicians = techniciansData.filter((technician) => {
    const matchesSearch =
      searchQuery === "" ||
      technician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technician.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || technician.status === statusFilter
    const matchesSpecialty = specialtyFilter === "all" || technician.specialty === specialtyFilter

    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const handleAddTechnician = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new technician with the form data
      const newId = `TC${100000 + techniciansData.length}`

      // In a real app, you would add this to your database
      // For now, we'll just show a success message
      alert(
        `Technician ${newTechnician.name} (${newId}) would be added to the database with ${newTechnician.certifications.length} certifications and status: ${newTechnician.status}.`,
      )

      // Reset form and close modal
      setNewTechnician({
        name: "",
        email: "",
        position: "Maintenance Technician",
        specialty: "General",
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
          <h1 className="text-3xl font-bold tracking-tight">Technicians Management</h1>
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
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Technician
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Technicians</CardTitle>
            <CardDescription>Manage maintenance technicians and their certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search technicians..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Only</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive Only</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("all")}>All Specialties</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("Mechanical")}>Mechanical</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("Electrical")}>Electrical</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("Hydraulic")}>Hydraulic</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("Avionics")}>Avionics</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter("General")}>General</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon">
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
                      <TableHead>Specialty</TableHead>
                      <TableHead>Airport</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechnicians.map((technician) => (
                      <TableRow key={technician.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={undefined || "/placeholder.svg"} alt={technician.name} />
                              <AvatarFallback>
                                {technician.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{technician.name}</p>
                              <p className="text-xs text-muted-foreground">{technician.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{technician.id}</TableCell>
                        <TableCell>{technician.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {technician.specialty === "Mechanical" && <Wrench className="mr-1 h-3 w-3" />}
                            {technician.specialty === "Electrical" && <Tool className="mr-1 h-3 w-3" />}
                            {technician.specialty}
                          </Badge>
                        </TableCell>
                        <TableCell>{technician.airport}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              technician.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {technician.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {technician.certifications.some((cert) => cert.status === "warning") && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Expiring
                              </Badge>
                            )}
                            {technician.certifications.some((cert) => cert.status === "expired") && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Expired
                              </Badge>
                            )}
                            {technician.certifications.every(
                              (cert) => cert.status !== "warning" && cert.status !== "expired",
                            ) && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Valid
                              </Badge>
                            )}
                            <Badge variant="outline">{technician.certifications.length}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(technician.hireDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTechnician(technician)
                                  setIsViewModalOpen(true)
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTechnician(technician)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTechnician(technician)
                                  setIsCertModalOpen(true)
                                }}
                              >
                                Manage Certifications
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  const newStatus = technician.status === "active" ? "inactive" : "active"
                                  alert(
                                    `Technician ${technician.id} status would be updated to ${newStatus}. This would call an API in a real application.`,
                                  )
                                }}
                              >
                                {technician.status === "active" ? "Deactivate" : "Activate"}
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

      {/* View Technician Modal */}
      {selectedTechnician && isViewModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Technician Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedTechnician.name}
              </p>
              <p>
                <strong>ID:</strong> {selectedTechnician.id}
              </p>
              <p>
                <strong>Email:</strong> {selectedTechnician.email}
              </p>
              <p>
                <strong>Position:</strong> {selectedTechnician.position}
              </p>
              <p>
                <strong>Specialty:</strong> {selectedTechnician.specialty}
              </p>
              <p>
                <strong>Airport:</strong> {selectedTechnician.airport}
              </p>
              <p>
                <strong>Status:</strong> {selectedTechnician.status}
              </p>
              <p>
                <strong>Hire Date:</strong> {new Date(selectedTechnician.hireDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Technician Modal */}
      {selectedTechnician && isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Technician</h2>
            <p className="mb-4">
              This would be an edit form for {selectedTechnician.name} (ID: {selectedTechnician.id})
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Changes would be saved here")
                  setIsEditModalOpen(false)
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Certifications Modal */}
      {selectedTechnician && isCertModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Manage Certifications</h2>
            <p className="mb-4">
              Certifications for {selectedTechnician.name} (ID: {selectedTechnician.id})
            </p>
            <ul className="mb-4">
              {selectedTechnician.certifications.map((cert: any, index: number) => (
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
              <Button onClick={() => setIsCertModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Technician Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New Technician</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={newTechnician.name}
                  onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
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
                  value={newTechnician.email}
                  onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
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
                    value={newTechnician.position}
                    onValueChange={(value) => setNewTechnician({ ...newTechnician, position: value })}
                  >
                    <SelectTrigger id="position" className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Maintenance Technician">Maintenance Technician</SelectItem>
                      <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                      <SelectItem value="Lead Technician">Lead Technician</SelectItem>
                      <SelectItem value="Specialist">Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-gray-300">
                    Specialty
                  </Label>
                  <Select
                    value={newTechnician.specialty}
                    onValueChange={(value) => setNewTechnician({ ...newTechnician, specialty: value })}
                  >
                    <SelectTrigger id="specialty" className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                      <SelectItem value="Avionics">Avionics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airport" className="text-gray-300">
                    Airport
                  </Label>
                  <Select
                    value={newTechnician.airport}
                    onValueChange={(value) => setNewTechnician({ ...newTechnician, airport: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="hireDate" className="text-gray-300">
                    Hire Date
                  </Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={newTechnician.hireDate}
                    onChange={(e) => setNewTechnician({ ...newTechnician, hireDate: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newTechnician.phone}
                  onChange={(e) => setNewTechnician({ ...newTechnician, phone: e.target.value })}
                  placeholder="+1 (416) 555-1234"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300">
                  Status
                </Label>
                <Select
                  value={newTechnician.status}
                  onValueChange={(value) => setNewTechnician({ ...newTechnician, status: value })}
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

              <div className="space-y-2">
                <Label className="text-gray-300">Certifications</Label>
                <div className="space-y-2 p-3 border border-gray-700 rounded-md">
                  {newTechnician.certifications.map((cert, index) => (
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
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        const certName = prompt("Enter certification name")
                        if (certName) {
                          setNewTechnician({
                            ...newTechnician,
                            certifications: [...newTechnician.certifications, { name: certName, status: "active" }],
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Valid Certification
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        const certName = prompt("Enter certification name")
                        if (certName) {
                          setNewTechnician({
                            ...newTechnician,
                            certifications: [...newTechnician.certifications, { name: certName, status: "expired" }],
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
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTechnician}
                disabled={!newTechnician.name || !newTechnician.email || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Adding..." : "Add Technician"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DesktopLayout>
  )
}
