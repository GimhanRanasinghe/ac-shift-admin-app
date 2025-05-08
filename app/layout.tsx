import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeProvider as CustomThemeProvider } from "@/components/theme-context"
import { DataProvider } from "@/context/data-context"
import { FeatureFlagsProvider } from "@/context/feature-flags-context"
import { ApiProvider } from "@/components/api-provider"
import { AuthProvider } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Air Canada GSE",
  description: "Ground Service Equipment Management System",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ApiProvider>
            <AuthProvider>
              <DataProvider>
                <FeatureFlagsProvider>
                  <CustomThemeProvider>{children}</CustomThemeProvider>
                </FeatureFlagsProvider>
              </DataProvider>
            </AuthProvider>
          </ApiProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
