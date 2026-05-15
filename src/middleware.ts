import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnInterview = req.nextUrl.pathname.startsWith("/interview")
  const isOnCoding = req.nextUrl.pathname.startsWith("/coding")
  const isOnResume = req.nextUrl.pathname.startsWith("/resume")
  const isOnSettings = req.nextUrl.pathname.startsWith("/settings")
  const isOnReports = req.nextUrl.pathname.startsWith("/reports")

  if (isOnDashboard || isOnInterview || isOnCoding || isOnResume || isOnSettings || isOnReports) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl))
    }
  }

  return
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
