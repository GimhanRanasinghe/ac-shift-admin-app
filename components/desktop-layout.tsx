"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AirCanadaLogo } from "@/components/air-canada-logo"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import {
  LayoutDashboard,
  Truck,
  Users,
  Calendar,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface DesktopLayoutProps {
  children: React.ReactNode
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const mainNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Fleet Management",
      href: "/fleet",
      icon: Truck,
      current: pathname.startsWith("/fleet"),
      subItems: [
        { name: "Equipment Inventory", href: "/fleet/inventory" },
        { name: "Maintenance Schedule", href: "/fleet/maintenance" },
        { name: "Equipment Onboarding", href: "/fleet/onboarding" },
        { name: "Equipment Types", href: "/fleet/equipment-types" },
      ],
    },
    {
      name: "Personnel",
      href: "/personnel",
      icon: Users,
      current: pathname.startsWith("/personnel"),
      subItems: [
        { name: "Operators", href: "/personnel/operators" },
        { name: "Technicians", href: "/personnel/technicians" },
        { name: "Certifications", href: "/personnel/certifications" },
        { name: "Training", href: "/personnel/training" },
      ],
    },
    {
      name: "Operations",
      href: "/operations",
      icon: Calendar,
      current: pathname.startsWith("/operations"),
      subItems: [
        { name: "Daily Schedule", href: "/operations/schedule" },
        { name: "Equipment Assignments", href: "/operations/assignments" },
        { name: "Flight Schedule", href: "/operations/flights" },
      ],
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
      current: pathname.startsWith("/maintenance"),
      subItems: [
        { name: "Work Orders", href: "/maintenance/work-orders" },
        { name: "Service History", href: "/maintenance/history" },
        { name: "Parts Inventory", href: "/maintenance/parts" },
      ],
    },
    {
      name: "Analytics & Reports",
      href: "/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/analytics"),
      subItems: [
        { name: "Equipment Utilization", href: "/analytics/utilization" },
        { name: "Maintenance Metrics", href: "/analytics/maintenance" },
        { name: "Personnel Performance", href: "/analytics/personnel" },
        { name: "Custom Reports", href: "/analytics/reports" },
      ],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname.startsWith("/settings"),
      subItems: [
        { name: "User Management", href: "/settings/users" },
        { name: "System Configuration", href: "/settings/system" },
        { name: "Notifications", href: "/settings/notifications" },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider defaultOpen={!collapsed}>
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border py-4">
            <div className="flex items-center px-4">
              <AirCanadaLogo className="h-8 w-auto" />
              <div className="ml-3 max-w-[120px] overflow-hidden">
                <h1 className="text-lg font-semibold text-foreground truncate">GSE Portal</h1>
                <p className="text-xs text-muted-foreground truncate">Administration</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.subItems ? (
                    <>
                      <SidebarMenuButton isActive={item.current}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                              <Link href={subItem.href}>{subItem.name}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </>
                  ) : (
                    <SidebarMenuButton asChild isActive={item.current}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/profile-photo.png" alt="Admin User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                {user && (
                <div className="ml-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              )}
                
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b border-border bg-background">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[300px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DarkModeToggle />
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    3
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      {user && (
                      <><Avatar className="h-8 w-8">
                          <AvatarImage src="/profile-photo.png" alt="Admin User" />
                          <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || ''}</AvatarFallback>
                        </Avatar><div className="ml-2">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div></>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  )
}
