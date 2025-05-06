import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // We no longer want to redirect /dashboard since it's a valid route in our desktop portal
  // If you need to redirect the old mobile routes, you can add specific redirects here

  return NextResponse.next()
}

export const config = {
  // Update matcher to include other routes if needed
  matcher: [],
}
