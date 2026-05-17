import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function middleware(req: NextRequest) {
  const session = await auth()
  const isLoggedIn = req.cookies.has("hiremind-logged-in") || !!session
  
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnInterview = req.nextUrl.pathname.startsWith("/interview")
  const isOnCoding = req.nextUrl.pathname.startsWith("/coding")
  const isOnResume = req.nextUrl.pathname.startsWith("/resume")
  const isOnSettings = req.nextUrl.pathname.startsWith("/settings")
  const isOnReports = req.nextUrl.pathname.startsWith("/reports")

  if (isOnDashboard || isOnInterview || isOnCoding || isOnResume || isOnSettings || isOnReports) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
