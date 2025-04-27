import { NextResponse } from "next/server"

// Handle both GET and POST for logout to ensure compatibility
export function GET() {
  return handleLogout()
}

export function POST() {
  return handleLogout()
}

function handleLogout() {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 })

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })

    // Also clear any NextAuth session cookies to ensure complete logout
    response.cookies.set("next-auth.session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 })
  }
}
