"use client"

import { useState } from "react"
import { DesktopLayout } from "@/components/desktop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Printer,
  Eye,
  Pencil,
  Trash2,
  Filter,
  SlidersHorizontal,
} from "lucide-react"
import { AddEquipmentTypeModal } from "@/components/fleet/add-equipment-type-modal"
import { EditEquipmentTypeModal } from "@/components/fleet/edit-equipment-type-modal"
import { EquipmentTypeDetailsModal } from "@/components/fleet/equipment-type-details-modal"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/context/data-context"

export default function EquipmentTypes() {
  const { equipmentTypes, deleteEquipmentType } = useData()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filterPowered, setFilterPowered] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("name")

  // Add error handling
  if (!equipmentTypes) {
    return (
      <DesktopLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Unable to load equipment types</h2>
            <p className="text-muted-foreground mb-4">There was an error loading the equipment types data.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DesktopLayout>
    )
  }

  // Filter equipment types based on search and filters
  const filteredTypes = equipmentTypes.filter((type) => {
    const matchesSearch =
      searchQuery === "" ||
      type.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.value.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPowered =
      filterPowered === null ||
      (filterPowered === "powered" && type.isPowered) ||
      (filterPowered === "non-powered" && !type.isPowered)

    const matchesCategory = filterCategory === null || type.category === filterCategory

    return matchesSearch && matchesPowered && matchesCategory
  })

  // Sort equipment types
  const sortedTypes = [...filteredTypes].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.label.localeCompare(b.label)
      case "maintenance":
        return a.maintenanceInterval - b.maintenanceInterval
      case "units":
        return (b.activeUnits || 0) - (a.activeUnits || 0)
      default:
        return 0
    }
  })

  const handleDeleteType = (typeValue: string) => {
    deleteEquipmentType(typeValue)
    toast({
      title: "Equipment Type Deleted",
      description: `Equipment type has been deleted.`,
    })
  }

  const handleViewDetails = (type: any) => {
    setSelectedType(type)
    setShowDetailsModal(true)
  }

  const handleEditType = (type: any) => {
    setSelectedType(type)
    setShowEditModal(true)
  }

  const categoryLabels: Record<string, string> = {
    towing: "Towing Equipment",
    loading: "Loading Equipment",
    support: "Support Equipment",
    service: "Service Equipment",
    other: "Other Equipment",
  }

  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Equipment Types</h1>
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
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment Type
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Equipment Type Management</CardTitle>
            <CardDescription>Define and manage equipment types and their specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search equipment types..."
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
                      <div className="p-2">
                        <p className="text-sm font-medium mb-1">Power Type</p>
                        <Select
                          value={filterPowered || "all"}
                          onValueChange={(value) => setFilterPowered(value === "all" ? null : value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="powered">Powered</SelectItem>
                            <SelectItem value="non-powered">Non-Powered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium mb-1">Category</p>
                        <Select
                          value={filterCategory || "all"}
                          onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="towing">Towing Equipment</SelectItem>
                            <SelectItem value="loading">Loading Equipment</SelectItem>
                            <SelectItem value="support">Support Equipment</SelectItem>
                            <SelectItem value="service">Service Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSortBy("name")}
                        className={sortBy === "name" ? "bg-accent" : ""}
                      >
                        Name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("maintenance")}
                        className={sortBy === "maintenance" ? "bg-accent" : ""}
                      >
                        Maintenance Interval
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("units")}
                        className={sortBy === "units" ? "bg-accent" : ""}
                      >
                        Active Units
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="table" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Power Type</TableHead>
                        <TableHead>Maintenance Interval</TableHead>
                        <TableHead>Required Certification</TableHead>
                        <TableHead>Active Units</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTypes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No equipment types found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedTypes.map((type) => (
                          <TableRow key={type.value}>
                            <TableCell className="font-medium">{type.label}</TableCell>
                            <TableCell>{categoryLabels[type.category]}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  type.isPowered
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }
                              >
                                {type.isPowered ? "Powered" : "Non-Powered"}
                              </Badge>
                            </TableCell>
                            <TableCell>{type.maintenanceInterval} days</TableCell>
                            <TableCell>{type.requiredCertification}</TableCell>
                            <TableCell>{type.activeUnits}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(type)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditType(type)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Type
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteType(type.value)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Type
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="grid" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedTypes.length === 0 ? (
                    <div className="col-span-full h-24 flex items-center justify-center text-muted-foreground">
                      No equipment types found.
                    </div>
                  ) : (
                    sortedTypes.map((type) => (
                      <Card key={type.value} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{type.label}</CardTitle>
                            <Badge
                              variant="outline"
                              className={
                                type.isPowered
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {type.isPowered ? "Powered" : "Non-Powered"}
                            </Badge>
                          </div>
                          <CardDescription>{categoryLabels[type.category]}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Maintenance:</span>
                              <span>{type.maintenanceInterval} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Certification:</span>
                              <span>{type.requiredCertification}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Active Units:</span>
                              <span>{type.activeUnits}</span>
                            </div>
                          </div>
                        </CardContent>
                        <div className="px-6 py-2 bg-muted/50 flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(type)}>
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditType(type)}>
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AddEquipmentTypeModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditEquipmentTypeModal equipment={selectedType} open={showEditModal} onOpenChange={setShowEditModal} />
      <EquipmentTypeDetailsModal
        equipmentType={selectedType}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </DesktopLayout>
  )
}
