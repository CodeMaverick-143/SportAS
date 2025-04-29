import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/user"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123"

export async function POST(request: NextRequest) {
  try {
    // Input validation
    let email, password;
    try {
      const body = await request.json();
      email = body.email?.trim().toLowerCase();
      password = body.password;
      
      // Validate required fields
      if (!email || !password) {
        return NextResponse.json({ 
          success: false, 
          message: "Email and password are required" 
        }, { status: 400 })
      }
    } catch (parseError) {
      console.error('Failed to parse login request:', parseError)
      return NextResponse.json({ 
        success: false, 
        message: "Invalid request format" 
      }, { status: 400 })
    }

    console.log(`Attempting login for: ${email}`)
    
    // Connect to the database
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      console.warn(`Login failed: User not found for email ${email}`)
      return NextResponse.json({ 
        success: false, 
        message: "Invalid email or password" 
      }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.warn(`Login failed: Invalid password for user ${email}`)
      return NextResponse.json({ 
        success: false, 
        message: "Invalid email or password" 
      }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create response with user data
    const response = NextResponse.json({
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
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt
      }
    })

    // Set cookie with token
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    })

    console.log(`Login successful for user: ${email}`)
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred during login" 
    }, { status: 500 })
  }
}