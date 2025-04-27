import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/user"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      console.warn('No auth token found in request')
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      
      // Connect to the database
      console.log('Connecting to database to fetch user:', decoded.id)
      await connectToDatabase()

      // Find user
      const user = await User.findById(decoded.id)

      if (!user) {
        console.warn(`User not found for ID: ${decoded.id}`)
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      console.log(`User ${user.email} authenticated successfully`)
      
      // Return user data with address and phone fields
      return NextResponse.json(
        {
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || {
              line1: "",
              city: "",
              state: "",
              pincode: ""
            },
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
          },
        },
        { status: 200 },
      )
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError)
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error('Authentication check error:', error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }

}
