import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/user"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123"

export async function POST(request: NextRequest) {
  try {
    // Input validation
    let name, email, password;
    try {
      const body = await request.json();
      name = body.name?.trim();
      email = body.email?.trim().toLowerCase();
      password = body.password;
      
      // Validate required fields
      if (!name || !email || !password) {
        return NextResponse.json({ 
          success: false, 
          message: "Name, email, and password are required" 
        }, { status: 400 })
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({
          success: false,
          message: "Please provide a valid email address"
        }, { status: 400 })
      }
      
      // Password strength validation
      if (password.length < 6) {
        return NextResponse.json({
          success: false,
          message: "Password must be at least 6 characters"
        }, { status: 400 })
      }
    } catch (parseError) {
      console.error('Failed to parse registration request:', parseError)
      return NextResponse.json({ 
        success: false, 
        message: "Invalid request format" 
      }, { status: 400 })
    }

    console.log(`Attempting registration for: ${email}`)

    // Connect to the database
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error('Database connection error during registration:', dbError)
      return NextResponse.json({ 
        success: false, 
        message: "Database connection error" 
      }, { status: 500 })
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        console.warn(`Registration failed: Email ${email} already in use`)
        return NextResponse.json({ 
          success: false, 
          message: "Email already in use" 
        }, { status: 400 })
      }
    } catch (userCheckError) {
      console.error('Error checking existing user:', userCheckError)
      return NextResponse.json({ 
        success: false, 
        message: "Error checking user availability" 
      }, { status: 500 })
    }

    // Create new user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
        phone: "",
        address: {
          line1: "",
          city: "",
          state: "",
          pincode: ""
        }
      })
      
      console.log(`User registered successfully: ${email}`)
    } catch (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json({ 
        success: false, 
        message: "Error creating user account" 
      }, { status: 500 })
    }

    // Create token for immediate login
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    )

    // Set up response with token and user data
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: "",
          address: {
            line1: "",
            city: "",
            state: "",
            pincode: ""
          },
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    )
    
    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}
