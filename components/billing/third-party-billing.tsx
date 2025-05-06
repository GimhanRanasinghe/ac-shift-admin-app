"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Printer,
  Search,
  Filter,
  Plus,
  Calendar,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample billing data
const billingData = [
  {
    id: "INV-2024-001",
    client: "Delta Airlines",
    date: "2024-05-01",
    dueDate: "2024-05-31",
    amount: 12450.75,
    status: "paid",
    items: [
      { description: "Baggage Tractor Rental", quantity: 5, rate: 850, amount: 4250 },
      { description: "Belt Loader Rental", quantity: 3, rate: 750, amount: 2250 },
      { description: "Pushback Tractor Rental", quantity: 2, rate: 1200, amount: 2400 },
      { description: "Maintenance Services", quantity: 15, rate: 125, amount: 1875 },
      { description: "Fuel Charges", quantity: 1, rate: 1675.75, amount: 1675.75 },
    ],
  },
  {
    id: "INV-2024-002",
    client: "United Airlines",
    date: "2024-05-05",
    dueDate: "2024-06-04",
    amount: 9875.5,
    status: "pending",
    items: [
      { description: "Ground Power Unit Rental", quantity: 2, rate: 950, amount: 1900 },
      { description: "Container Loader Rental", quantity: 3, rate: 1100, amount: 3300 },
      { description: "Lavatory Service Truck Rental", quantity: 1, rate: 875, amount: 875 },
      { description: "Maintenance Services", quantity: 12, rate: 125, amount: 1500 },
      { description: "Fuel Charges", quantity: 1, rate: 2300.5, amount: 2300.5 },
    ],
  },
  {
    id: "INV-2024-003",
    client: "American Airlines",
    date: "2024-05-10",
    dueDate: "2024-06-09",
    amount: 15320.25,
    status: "overdue",
    items: [
      { description: "Baggage Tractor Rental", quantity: 6, rate: 850, amount: 5100 },
      { description: "Belt Loader Rental", quantity: 4, rate: 750, amount: 3000 },
      { description: "Pushback Tractor Rental", quantity: 3, rate: 1200, amount: 3600 },
      { description: "Water Service Truck Rental", quantity: 1, rate: 825, amount: 825 },
      { description: "Maintenance Services", quantity: 18, rate: 125, amount: 2250 },
      { description: "Fuel Charges", quantity: 1, rate: 545.25, amount: 545.25 },
    ],
  },
  {
    id: "INV-2024-004",
    client: "Lufthansa",
    date: "2024-05-15",
    dueDate: "2024-06-14",
    amount: 7850.0,
    status: "draft",
    items: [
      { description: "Baggage Tractor Rental", quantity: 3, rate: 850, amount: 2550 },
      { description: "Belt Loader Rental", quantity: 2, rate: 750, amount: 1500 },
      { description: "Ground Power Unit Rental", quantity: 2, rate: 950, amount: 1900 },
      { description: "Maintenance Services", quantity: 8, rate: 125, amount: 1000 },
      { description: "Fuel Charges", quantity: 1, rate: 900, amount: 900 },
    ],
  },
  {
    id: "INV-2024-005",
    client: "British Airways",
    date: "2024-05-20",
    dueDate: "2024-06-19",
    amount: 10575.5,
    status: "pending",
    items: [
      { description: "Pushback Tractor Rental", quantity: 2, rate: 1200, amount: 2400 },
      { description: "Container Loader Rental", quantity: 3, rate: 1100, amount: 3300 },
      { description: "Belt Loader Rental", quantity: 3, rate: 750, amount: 2250 },
      { description: "Maintenance Services", quantity: 10, rate: 125, amount: 1250 },
      { description: "Fuel Charges", quantity: 1, rate: 1375.5, amount: 1375.5 },
    ],
  },
]

// Sample clients
const clients = [
  "Delta Airlines",
  "United Airlines",
  "American Airlines",
  "Lufthansa",
  "British Airways",
  "Air France",
  "KLM",
  "Emirates",
  "Qatar Airways",
  "Cathay Pacific",
]

export function ThirdPartyBilling() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [currentView, setCurrentView] = useState("invoices")

  // Filter invoices based on search and filters
  const filteredInvoices = billingData.filter((invoice) => {
    const matchesSearch =
      searchQuery === "" ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalBilled = billingData.reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalPaid = billingData
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalPending = billingData
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalOverdue = billingData
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Third-Party Billing</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">
                ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPaid / totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">
                ${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPending / totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">
                ${totalOverdue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalOverdue / totalBilled) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>Manage invoices and payments for third-party GSE usage</CardDescription>
            </div>
            <Tabs value={currentView} onValueChange={setCurrentView}>
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-2 md:w-auto">
                <div className="relative w-full md:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        $
                        {invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            invoice.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : invoice.status === "pending"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : invoice.status === "overdue"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print
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

      {selectedInvoice && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Details: {selectedInvoice.id}</CardTitle>
                <CardDescription>
                  Client: {selectedInvoice.client} | Date: {new Date(selectedInvoice.date).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  selectedInvoice.status === "paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : selectedInvoice.status === "pending"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : selectedInvoice.status === "overdue"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">${selectedInvoice.amount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send to Client
              </Button>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
